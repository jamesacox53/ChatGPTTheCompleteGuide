const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.json());

const DATA_FILE = path.join(__dirname, 'meetups.json');

// Helper function to read meetups data from JSON file
const readMeetupsFromFile = () => {
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
  } 
  return { nextId: 1, meetups: [] };
};

// Helper function to write meetups data to JSON file
const writeMeetupsToFile = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Ensure the meetups.json file exists
if (!fs.existsSync(DATA_FILE)) {
  writeMeetupsToFile({ nextId: 1, meetups: [] });
}

// POST /meetups
app.post('/meetups', (req, res) => {
  const { title, summary, address } = req.body;
  if (!title || !summary || !address) {
    return res.status(400).json({ error: 'Title, summary, and address are required' });
  }

  const data = readMeetupsFromFile();
  const meetup = { id: data.nextId++, title, summary, address };
  data.meetups.push(meetup);
  writeMeetupsToFile(data);

  res.status(201).json(meetup);
});

// GET /meetups
app.get('/meetups', (req, res) => {
  const data = readMeetupsFromFile();
  res.json(data.meetups);
});

// PATCH /meetups/:id
app.patch('/meetups/:id', (req, res) => {
  const { id } = req.params;
  const { title, summary, address } = req.body;

  const data = readMeetupsFromFile();
  const meetup = data.meetups.find(meetup => meetup.id == id);

  if (!meetup) {
    return res.status(404).json({ error: 'Meetup not found' });
  }

  if (title) meetup.title = title;
  if (summary) meetup.summary = summary;
  if (address) meetup.address = address;

  writeMeetupsToFile(data);

  res.json(meetup);
});

// DELETE /meetups/:id
app.delete('/meetups/:id', (req, res) => {
  const { id } = req.params;

  const data = readMeetupsFromFile();
  const index = data.meetups.findIndex(meetup => meetup.id == id);

  if (index === -1) {
    return res.status(404).json({ error: 'Meetup not found' });
  }

  data.meetups.splice(index, 1);
  writeMeetupsToFile(data);

  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});