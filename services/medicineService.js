// Business logic lives here, NOT in the routes.
// This way we can unit test these functions easily.

const LOW_STOCK_THRESHOLD = 5;

function isLowStock(stockAmount) {
  return stockAmount <= LOW_STOCK_THRESHOLD;
}

function isMedicineExpired(expirationDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expDate = new Date(expirationDate);
  return expDate < today;
}

// Returns true if medicine expires within the next 30 days
function isExpiringSoon(expirationDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expDate = new Date(expirationDate);
  const diffMs = expDate - today;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 30;
}

const VALID_FREQUENCIES = ['Günde 1 kez', 'Günde 2 kez', 'Günde 3 kez'];

// How many reminder times each frequency requires
const FREQUENCY_COUNT = {
  'Günde 1 kez': 1,
  'Günde 2 kez': 2,
  'Günde 3 kez': 3,
};

// Validates medicine input fields before saving
function validateMedicineInput(data) {
  const errors = [];

  if (!data.medicineName || data.medicineName.trim() === '') {
    errors.push('Medicine name is required');
  }

  if (!data.dosage || data.dosage.trim() === '') {
    errors.push('Dosage is required');
  }

  if (data.stockAmount === undefined || data.stockAmount === null || isNaN(data.stockAmount)) {
    errors.push('Stock amount must be a number');
  } else if (Number(data.stockAmount) < 0) {
    errors.push('Stock amount cannot be negative');
  }

  if (!data.expirationDate) {
    errors.push('Expiration date is required');
  } else {
    const date = new Date(data.expirationDate);
    if (isNaN(date.getTime())) {
      errors.push('Expiration date is not valid');
    }
  }

  // Validate frequency + reminderTimes together
  if (data.frequency) {
    if (!VALID_FREQUENCIES.includes(data.frequency)) {
      errors.push('Invalid frequency value');
    } else {
      const required = FREQUENCY_COUNT[data.frequency];
      const times = data.reminderTimes || [];
      if (times.length !== required) {
        errors.push(`${data.frequency} için ${required} hatırlatma saati girilmelidir`);
      } else {
        const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
        times.forEach((t, i) => {
          if (!timeRegex.test(t)) {
            errors.push(`${i + 1}. hatırlatma saati geçersiz (HH:MM formatında olmalı)`);
          }
        });
      }
    }
  }

  return errors;
}

// Adds warning flags to a medicine object
function enrichMedicineData(medicine) {
  return {
    ...medicine,
    lowStock: isLowStock(medicine.stockAmount),
    expired: isMedicineExpired(medicine.expirationDate),
    expiringSoon: isExpiringSoon(medicine.expirationDate),
  };
}

module.exports = { isLowStock, isMedicineExpired, isExpiringSoon, validateMedicineInput, enrichMedicineData, VALID_FREQUENCIES, FREQUENCY_COUNT };
