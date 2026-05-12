const db = require('./db');

async function getAllCategories() {
  const [rows] = await db.query('SELECT * FROM categories ORDER BY categoryName');
  return rows;
}

module.exports = { getAllCategories };
