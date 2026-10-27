
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Business settings
const TIME_ZONE = 'Africa/Nairobi';
const OPEN_TIME = '08:30';
const CLOSE_TIME = '19:30';

// Middleware
app.use(cors());
app.use(express.json());

// Get current date and time in Kenya
function getKenyaDateTime() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());

  const values = {};

  for (const part of parts) {
    if (part.type !== 'literal') {
      values[part.type] = part.value;
    }
  }

  return {
    date: `${values.year}-${values.month}-${values.day}`,
    time: `${values.hour}:${values.minute}`,
  };
}

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

// Get active services
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
  const {
    fullName,
    phone,
    date,
    time,
    vehicle,
    service,
    notes,
  } = req.body;

  // 1. Validate required fields
  if (
    typeof fullName !== 'string' ||
    !fullName.trim() ||
    typeof phone !== 'string' ||
    !phone.trim() ||
    typeof date !== 'string' ||
    typeof time !== 'string' ||
    typeof vehicle !== 'string' ||
    !vehicle.trim() ||
    typeof service !== 'string' ||
    !service.trim()
  ) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide all required booking details.',
    });
  }

  // 2. Validate the date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide a valid booking date.',
    });
  }

  // Check that the date actually exists
  const [year, month, day] = date.split('-').map(Number);
  const selectedDate = new Date(Date.UTC(year, month - 1, day));

  if (
    selectedDate.getUTCFullYear() !== year ||
    selectedDate.getUTCMonth() !== month - 1 ||
    selectedDate.getUTCDate() !== day
  ) {
    return res.status(400).json({
      status: 'error',
      message: 'The selected booking date is invalid.',
    });
  }

  // 3. Validate the time format
  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide a valid booking time.',
    });
  }

  // 4. Reject Saturdays
  // JavaScript: Sunday = 0, Saturday = 6
  if (selectedDate.getUTCDay() === 6) {
    return res.status(400).json({
      status: 'error',
      message: 'We are closed on Saturdays. Please select another day.',
    });
  }

  // 5. Check business hours
  if (time < OPEN_TIME || time > CLOSE_TIME) {
    return res.status(400).json({
      status: 'error',
      message: 'Bookings must be between 8:30 AM and 7:30 PM.',
    });
  }

  // 6. Reject past dates and times using Kenya's local time
  const now = getKenyaDateTime();

  if (date < now.date) {
    return res.status(400).json({
      status: 'error',
      message: 'You cannot book a date that has already passed.',
    });
  }

  if (date === now.date && time <= now.time) {
    return res.status(400).json({
      status: 'error',
      message: 'Please select a future booking time.',
    });
  }

  // 7. Validate Kenyan mobile number
  const normalizedPhone = phone.trim().replace(/[\s-]/g, '');

  const kenyanPhonePattern = /^(?:\+254|254|0)(?:7\d{8}|1\d{8})$/;

  if (!kenyanPhonePattern.test(normalizedPhone)) {
    return res.status(400).json({
      status: 'error',
      message: 'Please enter a valid Kenyan mobile number.',
    });
  }

  // 8. Validate optional notes
  if (
    notes !== undefined &&
    notes !== null &&
    typeof notes !== 'string'
  ) {
    return res.status(400).json({
      status: 'error',
      message: 'Booking notes must be text.',
    });
  }

  let client;

  try {
    client = await pool.connect();

    await client.query('BEGIN');

    // 9. Find the selected active service and its database price
    const serviceResult = await client.query(
      `SELECT service_id, price
       FROM services
       WHERE vehicle_type = $1
         AND service_name = $2
         AND is_active = TRUE`,
      [vehicle.trim(), service.trim()]
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

    // 10. Prevent simultaneous requests from creating duplicate
    // customer records for the same normalized phone number.
    // This lock applies only to requests using the same phone number.
    await client.query(
      'SELECT pg_advisory_xact_lock(hashtext($1))',
      [normalizedPhone]
    );

    // Find existing customer
    let customerResult = await client.query(
      `SELECT customer_id
       FROM customers
       WHERE phone = $1
       LIMIT 1`,
      [normalizedPhone]
    );

    let customerId;

    if (customerResult.rows.length > 0) {
      customerId = customerResult.rows[0].customer_id;

      await client.query(
        `UPDATE customers
         SET full_name = $1
         WHERE customer_id = $2`,
        [fullName.trim(), customerId]
      );
    } else {
      customerResult = await client.query(
        `INSERT INTO customers (full_name, phone)
         VALUES ($1, $2)
         RETURNING customer_id`,
        [fullName.trim(), normalizedPhone]
      );

      customerId = customerResult.rows[0].customer_id;
    }

    // 11. Save the booking.
    // Different customers can book the same date and time.
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

    await client.query('COMMIT');

    // 12. Return confirmation
    return res.status(201).json({
      status: 'success',
      message: 'Your booking has been submitted successfully!',
      booking: bookingResult.rows[0],
    });
  } catch (error) {
    if (client) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackError) {
        console.error(
          'Transaction rollback failed:',
          rollbackError.message
        );
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
  console.log(
    `Express Car Wash API running at http://localhost:${PORT}`
  );
});

