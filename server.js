const express = require('express');
const path = require('path');
const fs = require('fs');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('./helpers/fsUtils');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for Homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for Notes Page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// Get Request for Notes File
app.get('/api/notes', (req, res) => {
  readFromFile('./db/notes.json').then((data) => res.json(JSON.parse(data)));
});

// POST Request to Add a Note File
app.post('/api/notes', (req, res) => {
  console.log(req.body);

  const { title, text } = req.body;

  if (req.body) {
    const newTip = {
      title,
      text,
    };

    readAndAppend(newTip, './db/notes.json');
    res.json(`Tip added successfully 🚀`);
  } else {
    res.error('Error in adding tip');
  }
});


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
