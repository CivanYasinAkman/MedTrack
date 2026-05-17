const bcrypt = require('bcrypt');
const { createUser, findUserByUsername } = require('../models/userModel');

async function register(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

  const existing = await findUserByUsername(username);
  if (existing) return res.status(400).json({ error: 'Username already taken' });

  await createUser(username, password);
  res.status(201).json({ message: 'User created successfully' });
}

async function login(req, res) {
  const { username, password } = req.body;
  const user = await findUserByUsername(username);
  if (!user) return res.status(401).json({ error: 'Invalid username or password' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid username or password' });

  req.session.userId = user.id;
  req.session.username = user.username;
  res.json({ message: 'Login successful', username: user.username });
}

async function logout(req, res) {
  req.session.destroy();
  res.json({ message: 'Logged out' });
}

function getMe(req, res) {
  if (!req.session.userId) return res.status(401).json({ error: 'Not logged in' });
  res.json({ userId: req.session.userId, username: req.session.username });
}

module.exports = { register, login, logout, getMe };