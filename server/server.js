const pool = require('./config/db');

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'Express Car Wash API is running!',
  });
});

// Test route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Backend is working correctly.',
  });
});

app.get('/api/services', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT service_id, vehicle_type, service_name, price
       FROM services
       WHERE is_active = TRUE
       ORDER BY service_id ASC`
    );

    res.json({
      status: 'success',
      count: result.rows.length,
      services: result.rows
    });
  } catch (error) {
    console.error('Error fetching services:', error.message);

    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve services.'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Express Car Wash API running at http://localhost:${PORT}`);
});