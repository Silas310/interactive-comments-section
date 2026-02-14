const express = require('express');
const app = express();
const path = require('path');
const Comment = require('./models/comment');
const User = require('../src/models/User');

app.use(express.static(path.join(__dirname, '../public'))); // Serve static files from the public directory

app.use(express.json());

app.delete('/api/comments/:id', async (req, res) => {
  console.log('Delete request received for ID:', req.params.id);
  const { id } = req.params;

  try {
    const deletedComment = await Comment.findByIdAndDelete(id);

    if (deletedComment) {
      console.log('Parent comment deleted:', id);
      return res.status(204).end();
    }

    const updatedParent = await Comment.findOneAndUpdate(
      { "replies._id": id },
      { $pull: { replies: { _id: id } } }, // pull the reply with the given id from the replies array of its parent comment
      { new: true }
    );

    if (updatedParent) { // if a reply was deleted, return 204
      return res.status(204).end();
    }

    return res.status(404).json({ error: 'Comment or Reply not found' });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    console.error('Error deleting:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.get('/api/comments', (_req, res) => { // get all comments
  Comment.find({})
    .sort({ date: 1 }) // start from the oldest comment
    .then(comments =>{
      res.json(comments);
    })
    .catch( error => {
      console.error('Error fetching comments: ', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

app.get('/api/users/:id', (req, res) => { // get current user info by id
  const currentUser = req.params.id;

  User.findById(currentUser)
    .then(userInfo => {
      if (userInfo) {
        console.log('User info: ', userInfo);
        return res.json(userInfo);
      }
      res.status(404).json({ error: 'User not found' });
    })
    .catch(error => {
      if (error.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      console.error('Error fetching user info: ', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    });
})

app.post('/api/comments', (req, res) => { // add a new comment
  const info = req.body;
  
  if (!info.content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  const comment = new Comment({ // using as constructor to create a new comment object
    content: info.content,
    user: info.user,
  });

  comment.save() // using as mongoose model to save the comment to the database
    .then(savedComment => {
      res.status(201).json(savedComment);
      console.log('Comment saved: ', savedComment);
    })
    .catch(error => {
      console.error('Error saving comment: ', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
  });
});

app.patch('/api/comments/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try { // main comments logic
    let updated = await Comment.findByIdAndUpdate(
      id,
      {$set: updates},
      { new: true, runValidators: true }
    );

    if (!updated) { // reply logic
      const replyUpdates = {};
      for (let key in updates) { // update by keys with req.body received from the frontend
        replyUpdates[`replies.$.${key}`] = updates[key];
      }

      updated = await Comment.findOneAndUpdate(
        { "replies._id": id },
        { $set: replyUpdates }, // set new values with preeviously created replyUpdates object
        { new: true, runValidators: true }
      );
    }

    if (!updated) return res.status(404).json({ error: 'Not found' });
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/comments/:id/replies', (req, res) => { // add a reply to a comment
  const commentId = req.params.id;
  const replyInfo = req.body;

  if (!replyInfo.content || !replyInfo.replyingTo || !replyInfo.user) {
    return res.status(400).json({ error: 'Content required' });
  }

  const newReply = {
    content: replyInfo.content,
    replyingTo: replyInfo.replyingTo,
    user: replyInfo.user,
  };

  Comment.findByIdAndUpdate( // find the parent comment by id and update it
    commentId,
    { $push: { replies: newReply } }, // push the new reply to the replies array of the parent comment
    { new: true, runValidators: true }
  )
    .then(updatedComment => {
      if (updatedComment) {
        console.log('Reply added: ', updatedComment);
        return res.status(201).json(updatedComment);
      }
      res.status(404).json({ error: 'Parent comment not found' });
    })
    .catch(error => {
      if (error.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid comment ID' });
      }
      console.error('Error adding reply: ', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

module.exports = app;