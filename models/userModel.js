const db = require('./db');
const bcrypt = require('bcrypt');

async function createUser(username, password) {
  const hashed = await bcrypt.hash(password, 10);
  const [result] = await db.query(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, hashed]
  );
  return result.insertId;
}

async function findUserByUsername(username) {
  const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0] || null;
}

module.exports = { createUser, findUserByUsername };