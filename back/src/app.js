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

app.patch('/api/comments/:id', (req, res)=> { // update comments by id
  const id = req.params.id;
  const newInfo = req.body;
  
  Comment.findByIdAndUpdate(id, newInfo, { new: true, runValidators: true })
  .then(updatedComment => {
    if (updatedComment) {
      console.log('Comment updated: ', updatedComment);
      return res.json(updatedComment);
    }
    res.status(404).json({ error: 'Comment not found' });
  })
  .catch(error => {
    if (error.name === 'CastError') { // wrong id format
      return res.status(400).json({ error: 'Invalid comment ID' });
    }
    console.error('Error updating comment: ', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  });
})

module.exports = app;