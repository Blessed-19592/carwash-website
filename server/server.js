
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./config/db');

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

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Backend is working correctly.',
  });
});

// Get active services from PostgreSQL
app.get('/api/services', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT service_id, vehicle_type, service_name, price
       FROM services
       WHERE is_active = TRUE
       ORDER BY service_id ASC`
    );

    return res.json({
      status: 'success',
      count: result.rows.length,
      services: result.rows,
    });
  } catch (error) {
    console.error('Error fetching services:', error.message);

    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve services.',
    });
  }
});

// Create a booking
app.post('/api/bookings', async (req, res) => {
  const { fullName, phone, date, time, vehicle, service, notes } =
    req.body;

  // 1. Validate required fields
  if (
    typeof fullName !== 'string' ||
    !fullName.trim() ||
    typeof phone !== 'string' ||
    !phone.trim() ||
    !date ||
    !time ||
    !vehicle ||
    !service
  ) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide all required booking details.',
    });
  }

  // 2. Validate Kenyan mobile phone number format
  const normalizedPhone = phone.trim().replace(/[\s-]/g, '');

  const kenyanPhonePattern = /^(?:\+254|254|0)(?:7\d{8}|1\d{8})$/;

  if (!kenyanPhonePattern.test(normalizedPhone)) {
    return res.status(400).json({
      status: 'error',
      message: 'Please enter a valid Kenyan mobile number.',
    });
  }

  // 3. Validate optional notes
  if (notes !== undefined && notes !== null && typeof notes !== 'string') {
    return res.status(400).json({
      status: 'error',
      message: 'Booking notes must be text.',
    });
  }

  // 4. Connect to PostgreSQL
  let client;

  try {
    client = await pool.connect();

    // Begin transaction
    await client.query('BEGIN');

    // 5. Find the selected active service and its database price
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
        message: 'The selected service is unavailable for this vehicle.',
      });
    }

    const selectedService = serviceResult.rows[0];
    const amount = selectedService.price;

    // 6. Find an existing customer by normalized phone number
    let customerResult = await client.query(
      `SELECT customer_id
       FROM customers
       WHERE phone = $1
       LIMIT 1`,
      [normalizedPhone]
    );

    let customerId;

    if (customerResult.rows.length > 0) {
      // Reuse the existing customer
      customerId = customerResult.rows[0].customer_id;

      await client.query(
        `UPDATE customers
         SET full_name = $1
         WHERE customer_id = $2`,
        [fullName.trim(), customerId]
      );
    } else {
      // Create a new customer
      customerResult = await client.query(
        `INSERT INTO customers (full_name, phone)
         VALUES ($1, $2)
         RETURNING customer_id`,
        [fullName.trim(), normalizedPhone]
      );

      customerId = customerResult.rows[0].customer_id;
    }

    // 7. Save the booking
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
       RETURNING
         booking_id,
         status,
         amount,
         booking_date,
         booking_time`,
      [
        customerId,
        selectedService.service_id,
        date,
        time,
        amount,
        notes?.trim() || null,
      ]
    );

    // 8. Commit the transaction
    await client.query('COMMIT');

    // 9. Return the booking confirmation
    return res.status(201).json({
      status: 'success',
      message: 'Your booking has been submitted successfully!',
      booking: bookingResult.rows[0],
    });
  } catch (error) {
    // Roll back only if a transaction was started
    if (client) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackError) {
        console.error('Transaction rollback failed:', rollbackError.message);
      }
    }

    console.error('Error creating booking:', error.message);

    return res.status(500).json({
      status: 'error',
      message: 'Unable to save your booking. Please try again.',
    });
  } finally {
    if (client) {
      client.release();
    }
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Express Car Wash API running at http://localhost:${PORT}`);
});

