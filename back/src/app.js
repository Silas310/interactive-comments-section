const express = require('express');
const app = express();
const path = require('path');
const Comment = require('./models/comment');


app.use(express.static(path.join(__dirname, '../public'))); // Serve static files from the public directory

app.use(express.json()); 

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

app.delete('/api/comments/:id', (req, res) => { // delete comments by id
  const id = req.params.id;

  Comment.findByIdAndDelete(id)
    .then( deletedComment => {
      if (deletedComment) {
        console.log('Comment deleted: ', deletedComment);
        return res.status(204).end();
      }
      res.status(404).json({ error: 'Comment not found' });
      
    })
    .catch( error => {
      if (error.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid comment ID' });
      }
      console.error('Error deleting comment: ', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    });
}) 

module.exports = app;