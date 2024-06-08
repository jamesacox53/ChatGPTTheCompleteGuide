const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

const SECRET_KEY = 'your_secret_key'; // Change this to a more secure secret key in production

app.use(bodyParser.json());

const MEETUPS_FILE = path.join(__dirname, 'meetups.json');
const USERS_FILE = path.join(__dirname, 'users.json');

// Helper functions to read and write JSON data
const readDataFromFile = (file) => {
  if (fs.existsSync(file)) {
    const data = fs.readFileSync(file);
    return JSON.parse(data);
  }
  return { nextId: 1, data: [] };
};

const writeDataToFile = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

// Initialize files if they don't exist
if (!fs.existsSync(MEETUPS_FILE)) {
  writeDataToFile(MEETUPS_FILE, { nextId: 1, data: [] });
}

if (!fs.existsSync(USERS_FILE)) {
  writeDataToFile(USERS_FILE, { nextId: 1, data: [] });
}

// Middleware to authenticate users
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// POST /signup
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const usersData = readDataFromFile(USERS_FILE);

  const existingUser = usersData.data.find(user => user.email === email);
  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: usersData.nextId++, email, password: hashedPassword };
  usersData.data.push(user);
  writeDataToFile(USERS_FILE, usersData);

  res.status(201).json({ message: 'User created' });
});

// POST /login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const usersData = readDataFromFile(USERS_FILE);
  const user = usersData.data.find(user => user.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// POST /meetups
app.post('/meetups', authenticateToken, (req, res) => {
  const { title, summary, address } = req.body;
  if (!title || !summary || !address) {
    return res.status(400).json({ error: 'Title, summary, and address are required' });
  }

  const meetupsData = readDataFromFile(MEETUPS_FILE);
  const meetup = { id: meetupsData.nextId++, title, summary, address };
  meetupsData.data.push(meetup);
  writeDataToFile(MEETUPS_FILE, meetupsData);

  res.status(201).json(meetup);
});

// GET /meetups
app.get('/meetups', authenticateToken, (req, res) => {
  const meetupsData = readDataFromFile(MEETUPS_FILE);
  res.json(meetupsData.data);
});

// PATCH /meetups/:id
app.patch('/meetups/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, summary, address } = req.body;

  const meetupsData = readDataFromFile(MEETUPS_FILE);
  const meetup = meetupsData.data.find(meetup => meetup.id == id);

  if (!meetup) {
    return res.status(404).json({ error: 'Meetup not found' });
  }

  if (title) meetup.title = title;
  if (summary) meetup.summary = summary;
  if (address) meetup.address = address;

  writeDataToFile(MEETUPS_FILE, meetupsData);

  res.json(meetup);
});

// DELETE /meetups/:id
app.delete('/meetups/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  const meetupsData = readDataFromFile(MEETUPS_FILE);
  const index = meetupsData.data.findIndex(meetup => meetup.id == id);

  if (index === -1) {
    return res.status(404).json({ error: 'Meetup not found' });
  }

  meetupsData.data.splice(index, 1);
  writeDataToFile(MEETUPS_FILE, meetupsData);

  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});