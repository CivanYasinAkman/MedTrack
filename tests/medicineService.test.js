const {
  isLowStock,
  isMedicineExpired,
  isExpiringSoon,
  validateMedicineInput,
  enrichMedicineData,
} = require('../services/medicineService');

describe('isLowStock', () => {
  test('should return true when stock is 5 or below', () => {
    expect(isLowStock(5)).toBe(true);
    expect(isLowStock(0)).toBe(true);
    expect(isLowStock(3)).toBe(true);
  });

  test('should return false when stock is above 5', () => {
    expect(isLowStock(6)).toBe(false);
    expect(isLowStock(100)).toBe(false);
  });
});

describe('isMedicineExpired', () => {
  test('should return true for a past date', () => {
    expect(isMedicineExpired('2020-01-01')).toBe(true);
    expect(isMedicineExpired('2023-06-15')).toBe(true);
  });

  test('should return false for a future date', () => {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);
    const futureStr = future.toISOString().split('T')[0];
    expect(isMedicineExpired(futureStr)).toBe(false);
  });
});

describe('isExpiringSoon', () => {
  test('should return true if expiration is within 30 days', () => {
    const soon = new Date();
    soon.setDate(soon.getDate() + 10);
    const soonStr = soon.toISOString().split('T')[0];
    expect(isExpiringSoon(soonStr)).toBe(true);
  });

  test('should return false if expiration is more than 30 days away', () => {
    const far = new Date();
    far.setDate(far.getDate() + 60);
    const farStr = far.toISOString().split('T')[0];
    expect(isExpiringSoon(farStr)).toBe(false);
  });

  test('should return false for already expired medicine', () => {
    expect(isExpiringSoon('2020-01-01')).toBe(false);
  });
});

describe('validateMedicineInput', () => {
  const validInput = {
    medicineName: 'Paracetamol',
    dosage: '500mg',
    stockAmount: 20,
    expirationDate: '2026-12-01',
  };

  test('should return no errors for valid input', () => {
    const errors = validateMedicineInput(validInput);
    expect(errors.length).toBe(0);
  });

  test('should return error if medicineName is empty', () => {
    const errors = validateMedicineInput({ ...validInput, medicineName: '' });
    expect(errors).toContain('Medicine name is required');
  });

  test('should return error if stockAmount is negative', () => {
    const errors = validateMedicineInput({ ...validInput, stockAmount: -1 });
    expect(errors).toContain('Stock amount cannot be negative');
  });

  test('should return error if stockAmount is not a number', () => {
    const errors = validateMedicineInput({ ...validInput, stockAmount: 'abc' });
    expect(errors).toContain('Stock amount must be a number');
  });

  test('should return error if expirationDate is missing', () => {
    const errors = validateMedicineInput({ ...validInput, expirationDate: '' });
    expect(errors).toContain('Expiration date is required');
  });

  test('should return error if expirationDate is invalid', () => {
    const errors = validateMedicineInput({ ...validInput, expirationDate: 'not-a-date' });
    expect(errors).toContain('Expiration date is not valid');
  });
});

describe('enrichMedicineData', () => {
  test('should add lowStock, expired, expiringSoon fields', () => {
    const medicine = {
      id: 1,
      medicineName: 'Ibuprofen',
      stockAmount: 2,
      expirationDate: '2020-01-01',
    };
    const result = enrichMedicineData(medicine);
    expect(result.lowStock).toBe(true);
    expect(result.expired).toBe(true);
    expect(result.expiringSoon).toBe(false);
  });
});
