const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, '../public'))); // Serve static files from the public directory

app.use(express.json()); 

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.get('/api/comments', (_req, res) => { // get all comments
  try {
    const data = require('../public/data/data.json');
    res.json(data);
  } catch (error) {
    console.error('Error reading data:', error);
    res.status(500).json({ error: 'Failed to read data' });
  }
});

module.exports = app;