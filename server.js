const session = require('express-session');
const authRoutes = require('./routes/auth');
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const medicineRoutes = require('./routes/medicines');
const categoryRoutes = require('./routes/categories');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({
  secret: 'medtrack-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 gün
}));
app.use(express.static(path.join(__dirname, 'frontend')));

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MedTrack API',
      version: '1.0.0',
      description: 'API for Medicine Reminder & Pill Tracker',
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/medicines', medicineRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);

// Serve frontend for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`MedTrack running at http://localhost:${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});

module.exports = app;
