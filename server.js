const express = require('express');
const path = require('path');
const fs = require('fs');
const {
  readFromFile,
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
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);

  // Destructuring assignment for the items in req.body
  const { title , text } = req.body;
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
    };

    // Obtain existing reviews
    fs.readFile('./db/notes.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);

        // Add a new note to the array
        parsedNotes.push(newNote);

        // Write updated reviews back to the file
        fs.writeFile(
          './db/notes.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully added a new note')
        );
      }
    });
  }


});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
