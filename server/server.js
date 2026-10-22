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

// Start server
app.listen(PORT, () => {
  console.log(`Express Car Wash API running at http://localhost:${PORT}`);
});