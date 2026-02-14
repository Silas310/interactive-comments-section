const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const app = require('./app');

const url = process.env.MONGODB_URI;
const port = process.env.PORT;

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });
  
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
