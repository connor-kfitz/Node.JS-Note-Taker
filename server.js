const express = require('express');
const path = require('path');
const fs = require('fs');

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
  // Send a message to the client
  res.status(200).json(`${req.method} request received to get notes`);

  // Log our request to the terminal
  console.info(`${req.method} request received to get notes`);
});

// POST Request to Add a Note File
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);

  // Destructuring assignment for the items in req.body
  const { title , text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      // review_id: uuid(),
    };
    // Write updated reviews back to the file
    fs.writeFile(
      './db/notes.json',
      JSON.stringify(newNote, null, 4),
      (writeErr) =>
        writeErr
          ? console.error(writeErr)
          : console.info('Successfully added a new note')
    );
      }
});
  
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
