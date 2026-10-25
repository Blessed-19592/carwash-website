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

app.post('/api/bookings', async (req, res) => {
  const { fullName, phone, date, time, vehicle, service, notes } = req.body;

  // 1. Validate required fields
  if (!fullName || !phone || !date || !time || !vehicle || !service) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide all required booking details.'
    });
  }

  // 2. Start a database transaction
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 3. Find the selected service and get its actual database price
    const serviceResult = await client.query(
      `SELECT service_id, price
       FROM services
       WHERE vehicle_type = $1
         AND service_name = $2
         AND is_active = TRUE`,
      [vehicle, service]
    );

    if (serviceResult.rows.length === 0) {
      await client.query('ROLLBACK');

      return res.status(400).json({
        status: 'error',
        message: 'The selected service is unavailable for this vehicle.'
      });
    }

    const selectedService = serviceResult.rows[0];
    const amount = selectedService.price;

    // 4. Reuse the customer if their phone number already exists
    let customerResult = await client.query(
      `SELECT customer_id
       FROM customers
       WHERE phone = $1
       LIMIT 1`,
      [phone.trim()]
    );

    let customerId;

    if (customerResult.rows.length > 0) {
      customerId = customerResult.rows[0].customer_id;

      // Update the customer's name with the latest submitted name
      await client.query(
        `UPDATE customers
         SET full_name = $1
         WHERE customer_id = $2`,
        [fullName.trim(), customerId]
      );
    } else {
      // 5. Create a new customer if the phone number is not registered
      customerResult = await client.query(
        `INSERT INTO customers (full_name, phone)
         VALUES ($1, $2)
         RETURNING customer_id`,
        [fullName.trim(), phone.trim()]
      );

      customerId = customerResult.rows[0].customer_id;
    }

    // 6. Save the booking
    const bookingResult = await client.query(
      `INSERT INTO bookings (
         customer_id,
         service_id,
         booking_date,
         booking_time,
         amount,
         notes
       )
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING booking_id, status, amount, booking_date, booking_time`,
      [
        customerId,
        selectedService.service_id,
        date,
        time,
        amount,
        notes?.trim() || null
      ]
    );

    // 7. Commit the transaction
    await client.query('COMMIT');

    // 8. Send confirmation data to the frontend
    return res.status(201).json({
      status: 'success',
      message: 'Your booking has been submitted successfully!',
      booking: bookingResult.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');

    console.error('Error creating booking:', error.message);

    return res.status(500).json({
      status: 'error',
      message: 'Unable to save your booking. Please try again.'
    });

  } finally {
    client.release();
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Express Car Wash API running at http://localhost:${PORT}`);
});