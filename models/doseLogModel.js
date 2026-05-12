const db = require('./db');

async function logDose(medicineId, dosageTaken) {
  const [result] = await db.query(
    'INSERT INTO dose_logs (medicineId, dosageTaken) VALUES (?, ?)',
    [medicineId, dosageTaken]
  );

  // Also reduce stock by 1 when a dose is logged
  await db.query('UPDATE medicines SET stockAmount = stockAmount - 1 WHERE id = ? AND stockAmount > 0', [medicineId]);

  return result.insertId;
}

async function getLogsForMedicine(medicineId) {
  const [rows] = await db.query(
    'SELECT * FROM dose_logs WHERE medicineId = ? ORDER BY takenAt DESC',
    [medicineId]
  );
  return rows;
}

module.exports = { logDose, getLogsForMedicine };
