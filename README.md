# MedTrack – Medicine Reminder & Pill Tracker

A full-stack CRUD application built for the System Analysis and Design course (Spring 2026).

## What it does

MedTrack helps you manage your medications. You can add medicines, track how many pills you have left, see which ones are about to expire, and log when you take a dose.

---

## Tech Stack

- **Frontend:** Vanilla JavaScript, HTML, CSS (Single Page Application)
- **Backend:** Node.js + Express
- **Database:** MySQL
- **Testing:** Jest
- **API Docs:** Swagger UI

---

## Project Structure

```
medtrack/
├── server.js              # Entry point
├── schema.sql             # Database setup
├── routes/                # API route definitions
├── controllers/           # Request/response handling
├── services/              # Business logic (testable)
├── models/                # Database queries
├── tests/                 # Unit tests
└── frontend/              # HTML, CSS, JS (SPA)
```

---

## Setup & Running

### 1. Create the database

Make sure MySQL is running, then run:

```bash
mysql -u root -p < schema.sql
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in your database credentials:

```bash
cp .env.example .env
```

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=medtrack
PORT=3000
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the server

```bash
npm start
```

Or with auto-reload during development:

```bash
npm run dev
```

The app will be running at: **http://localhost:3000**

---

## API Documentation

Swagger UI is available at: **http://localhost:3000/api-docs**

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/medicines | Get all medicines (supports `?search=`) |
| GET | /api/medicines/:id | Get one medicine |
| POST | /api/medicines | Create a medicine |
| PUT | /api/medicines/:id | Update a medicine |
| DELETE | /api/medicines/:id | Delete a medicine |
| POST | /api/medicines/:id/log-dose | Log a dose taken |
| GET | /api/medicines/:id/logs | Get dose history |
| GET | /api/categories | Get all categories |

---

## Running Tests

```bash
npm test
```

Tests cover the business logic functions in `services/medicineService.js`:

- `isLowStock()` – detects when stock is at or below 5 units
- `isMedicineExpired()` – checks if expiration date has passed
- `isExpiringSoon()` – checks if medicine expires within 30 days
- `validateMedicineInput()` – validates form data
- `enrichMedicineData()` – adds computed warning flags to medicine objects

---

## Features

- Full CRUD for medicines
- Category-based organization
- Search by medicine name
- Low stock warnings (≤5 units)
- Expiration date tracking
- Dose logging with stock auto-decrement
- Frontend + backend validation
- Swagger API documentation
