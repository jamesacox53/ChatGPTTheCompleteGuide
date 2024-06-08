const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// In-memory storage for meetups (for demo purposes)
let meetups = [];
let nextId = 1;

// POST /meetups
app.post('/meetups', (req, res) => {
  const meetup = { id: nextId++, ...req.body };
  meetups.push(meetup);
  res.status(201).json(meetup);
});

// GET /meetups
app.get('/meetups', (req, res) => {
  res.json(meetups);
});

// PATCH /meetups/:id
app.patch('/meetups/:id', (req, res) => {
  const { id } = req.params;
  const index = meetups.findIndex(meetup => meetup.id == id);

  if (index === -1) {
    return res.status(404).json({ error: 'Meetup not found' });
  }

  meetups[index] = { ...meetups[index], ...req.body };
  res.json(meetups[index]);
});

// DELETE /meetups/:id
app.delete('/meetups/:id', (req, res) => {
  const { id } = req.params;
  const index = meetups.findIndex(meetup => meetup.id == id);

  if (index === -1) {
    return res.status(404).json({ error: 'Meetup not found' });
  }

  meetups.splice(index, 1);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
