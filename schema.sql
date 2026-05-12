-- Run this file first to set up the database
-- mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS medtrack;
USE medtrack;

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  categoryName VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS medicines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  medicineName VARCHAR(150) NOT NULL,
  dosage VARCHAR(100) NOT NULL,
  stockAmount INT NOT NULL DEFAULT 0,
  expirationDate DATE NOT NULL,
  categoryId INT,
  reminderTimes JSON,
  frequency ENUM('Günde 1 kez','Günde 2 kez','Günde 3 kez'),
  isActive TINYINT(1) DEFAULT 1,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS dose_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  medicineId INT NOT NULL,
  takenAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  dosageTaken VARCHAR(100),
  FOREIGN KEY (medicineId) REFERENCES medicines(id) ON DELETE CASCADE
);

-- Some starter categories
INSERT INTO categories (categoryName) VALUES
  ('Painkiller'),
  ('Antibiotic'),
  ('Vitamin'),
  ('Allergy Medicine');
