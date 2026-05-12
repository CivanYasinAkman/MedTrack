const db = require('./db');

/**
 * Yardımcı Fonksiyon: MySQL'den gelen veriyi JavaScript objesine dönüştürür.
 */
function parseMedicine(row) {
  if (!row) return null;

  if (typeof row.reminderTimes === 'string') {
    try {
      row.reminderTimes = JSON.parse(row.reminderTimes);
    } catch (e) {
      console.error("JSON Parse Hatası:", e);
      row.reminderTimes = [];
    }
  }

  if (!row.reminderTimes) {
    row.reminderTimes = [];
  }

  return row;
}

// Tüm ilaçları getir
async function getAllMedicines() {
  const [rows] = await db.query(`
    SELECT m.*, c.categoryName
    FROM medicines m
    LEFT JOIN categories c ON m.categoryId = c.id
    ORDER BY m.id DESC
  `);
  return rows.map(parseMedicine);
}

async function getMedicineById(id) {
  const [rows] = await db.query(`
    SELECT m.*, c.categoryName
    FROM medicines m
    LEFT JOIN categories c ON m.categoryId = c.id
    WHERE m.id = ?
  `, [id]);
  return rows[0] ? parseMedicine(rows[0]) : null;
}

// İlaç Oluştur
async function createMedicine(data) {
  const { medicineName, dosage, stockAmount, expirationDate, categoryId, reminderTimes, frequency } = data;
  
  const timesJson = Array.isArray(reminderTimes) ? JSON.stringify(reminderTimes) : JSON.stringify([]);

  const [result] = await db.query(
    `INSERT INTO medicines (medicineName, dosage, stockAmount, expirationDate, categoryId, reminderTimes, frequency)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [medicineName, dosage, stockAmount, expirationDate, categoryId || null, timesJson, frequency || null]
  );
  return getMedicineById(result.insertId);
}

// İlaç Güncelle (HATA BURADAYDI - isActive KALDIRILDI)
async function updateMedicine(id, data) {
  const { medicineName, dosage, stockAmount, expirationDate, categoryId, reminderTimes, frequency } = data;
  
  // reminderTimes zaten controller tarafında string'e çevrilmiş olabilir, 
  // ama burada işimizi garantiye alıyoruz.
  let timesJson;
  if (typeof reminderTimes === 'string') {
    timesJson = reminderTimes;
  } else {
    timesJson = Array.isArray(reminderTimes) ? JSON.stringify(reminderTimes) : JSON.stringify([]);
  }

  // SORGUDAN isActive TAMAMEN ÇIKARILDI
  await db.query(
    `UPDATE medicines SET medicineName=?, dosage=?, stockAmount=?, expirationDate=?,
     categoryId=?, reminderTimes=?, frequency=? WHERE id=?`,
    [medicineName, dosage, stockAmount, expirationDate, categoryId || null, timesJson, frequency || null, id]
  );
  return getMedicineById(id);
}

async function deleteMedicine(id) {
  const [result] = await db.query('DELETE FROM medicines WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

async function searchMedicines(query) {
  const [rows] = await db.query(`
    SELECT m.*, c.categoryName
    FROM medicines m
    LEFT JOIN categories c ON m.categoryId = c.id
    WHERE m.medicineName LIKE ?
  `, [`%${query}%`]);
  return rows.map(parseMedicine);
}

module.exports = { getAllMedicines, getMedicineById, createMedicine, updateMedicine, deleteMedicine, searchMedicines };