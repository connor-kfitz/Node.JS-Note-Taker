const express = require('express');
const path = require('path');
const { readFromFile, readAndAppend } = require('./helpers/fsUtils');

const PORT = process.env.PORT || 3001

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

// Get Request for Notes JSON File
app.get('/api/notes', (req, res) => {
  readFromFile('./db/notes.json').then((data) => res.json(JSON.parse(data)));
});

// POST Request to Add a Note to Notes JSON File
app.post('/api/notes', (req, res) => {
  console.log(req.body);

  const { title, text } = req.body;

  // Making sure the note has a title and text (it should always as the save button will not appear without both fields entered)
  if (req.body) {
    const newNote = {
      title,
      text,
    };

    readAndAppend(newNote, './db/notes.json');
    res.json(`Your note was added successfully`);
  } else {
    res.error('Error in adding the note');
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
