const medicineModel = require('../models/medicineModel');
const doseLogModel = require('../models/doseLogModel');
const categoryModel = require('../models/categoryModel');
const { validateMedicineInput, enrichMedicineData, VALID_FREQUENCIES } = require('../services/medicineService');

async function getAllMedicines(req, res) {
  try {
    const { search } = req.query;
    let medicines;
    
    // getTracks/getAllMedicines fonksiyonlarında arama yaparken req.session.userId gönderiliyor
    if (search) {
      medicines = await medicineModel.searchMedicines(search, req.session.userId);
    } else {
      medicines = await medicineModel.getAllMedicines(req.session.userId);
    }
    
    const enriched = medicines.map(enrichMedicineData);
    res.json(enriched);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch medicines' });
  }
}

async function getMedicineById(req, res) {
  try {
    const medicine = await medicineModel.getMedicineById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    
    // Sahiplik Kontrolü: İlaç giriş yapan kullanıcıya mı ait?
    if (medicine.userId !== req.session.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(enrichMedicineData(medicine));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch medicine' });
  }
}

async function createMedicine(req, res) {
  try {
    const errors = validateMedicineInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // req.body'e giriş yapan kullanıcının userId'sini ekliyoruz
    const medicineData = { ...req.body, userId: req.session.userId };
    
    // Veritabanı dizi kabul etmediği için JSON string'e çeviriyoruz
    if (Array.isArray(medicineData.reminderTimes)) {
      medicineData.reminderTimes = JSON.stringify(medicineData.reminderTimes);
    }

    const medicine = await medicineModel.createMedicine(medicineData);
    res.status(201).json(medicine);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create medicine' });
  }
}

async function updateMedicine(req, res) {
  try {
    const existing = await medicineModel.getMedicineById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    // Sahiplik Kontrolü
    if (existing.userId !== req.session.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const errors = validateMedicineInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const medicineData = { ...req.body };
    if (Array.isArray(medicineData.reminderTimes)) {
      medicineData.reminderTimes = JSON.stringify(medicineData.reminderTimes);
    }

    const updated = await medicineModel.updateMedicine(req.params.id, medicineData);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update medicine' });
  }
}

async function deleteMedicine(req, res) {
  try {
    const existing = await medicineModel.getMedicineById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    // Sahiplik Kontrolü
    if (existing.userId !== req.session.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await medicineModel.deleteMedicine(req.params.id);
    res.json({ message: 'Medicine deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete medicine' });
  }
}

async function logDose(req, res) {
  try {
    const medicine = await medicineModel.getMedicineById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    
    // Sahiplik Kontrolü
    if (medicine.userId !== req.session.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (medicine.stockAmount <= 0) {
      return res.status(400).json({ error: 'No stock remaining' });
    }
    
    await doseLogModel.logDose(req.params.id, medicine.dosage);
    res.json({ message: 'Dose logged successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to log dose' });
  }
}

async function getDoseLogs(req, res) {
  try {
    const medicine = await medicineModel.getMedicineById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    
    // Sahiplik Kontrolü
    if (medicine.userId !== req.session.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const logs = await doseLogModel.getLogsForMedicine(req.params.id);
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dose logs' });
  }
}

async function getCategories(req, res) {
  try {
    const categories = await categoryModel.getAllCategories();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
}

module.exports = { getAllMedicines, getMedicineById, createMedicine, updateMedicine, deleteMedicine, logDose, getDoseLogs, getCategories };