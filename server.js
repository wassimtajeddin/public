const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/cv', (res) => {
  res.sendFile(path.join(__dirname, 'cv.html'));
});

app.get('/projects', (res) => {
  res.sendFile(path.join(__dirname, 'projects.html'));
});

app.get('/contact', (res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});