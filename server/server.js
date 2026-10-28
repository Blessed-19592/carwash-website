
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Business settings
const TIME_ZONE = 'Africa/Nairobi';
const OPEN_TIME = '08:30';
const CLOSE_TIME = '19:30';

// Middleware
// Security headers
app.use(helmet());

// Allow requests from the frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Parse JSON request bodies
app.use(express.json());

// PostgreSQL-backed administrator sessions
app.use(
  session({
    store: new pgSession({
      pool,
      tableName: 'admin_sessions',
      createTableIfMissing: true,
    }),
    name: 'express_car_wash_sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 8,
    },
  })
);


// Limit repeated administrator login attempts.
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many login attempts. Please try again later.',
  },
});

// Protect administrator-only routes.
function requireAdmin(req, res, next) {
  if (!req.session || !req.session.adminId) {
    return res.status(401).json({
      status: 'error',
      message: 'Please log in to access this resource.',
    });
  }

  next();
}



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


// Administrator login
app.post('/api/admin/login', adminLoginLimiter, async (req, res, next) => {
  const { email, password } = req.body;

  // Validate the submitted credentials.
  if (
    typeof email !== 'string' ||
    !email.trim() ||
    typeof password !== 'string' ||
    !password
  ) {
    return res.status(400).json({
      status: 'error',
      message: 'Email and password are required.',
    });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();

    // Find the active administrator account.
    const result = await pool.query(
      `SELECT admin_id, full_name, email, password_hash
       FROM admin_users
       WHERE email = $1
         AND is_active = TRUE
       LIMIT 1`,
      [normalizedEmail]
    );

    const bcrypt = require('bcrypt');

    // Use a generic message to avoid revealing whether an email exists.
    if (
      result.rows.length === 0 ||
      !(await bcrypt.compare(
        password,
        result.rows[0].password_hash
      ))
    ) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password.',
      });
    }

    const admin = result.rows[0];

    // Regenerate the session after authentication to prevent
    // session fixation.
    req.session.regenerate((sessionError) => {
      if (sessionError) {
        return next(sessionError);
      }

      req.session.adminId = admin.admin_id;

      req.session.save((saveError) => {
        if (saveError) {
          return next(saveError);
        }

        return res.status(200).json({
          status: 'success',
          message: 'Login successful.',
          admin: {
            id: admin.admin_id,
            fullName: admin.full_name,
            email: admin.email,
          },
        });
      });
    });
  } catch (error) {
    console.error('Administrator login failed:', error.message);

    return res.status(500).json({
      status: 'error',
      message: 'Unable to log in right now. Please try again.',
    });
  }
});


// Check whether the administrator is logged in.
app.get('/api/admin/me', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT admin_id, full_name, email
       FROM admin_users
       WHERE admin_id = $1
         AND is_active = TRUE
       LIMIT 1`,
      [req.session.adminId]
    );

    if (result.rows.length === 0) {
      return req.session.destroy(() => {
        res.clearCookie('express_car_wash_sid', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        });

        return res.status(401).json({
          status: 'error',
          message: 'Administrator account is unavailable. Please log in again.',
        });
      });
    }

    const admin = result.rows[0];

    return res.json({
      status: 'success',
      admin: {
        id: admin.admin_id,
        fullName: admin.full_name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error('Administrator session check failed:', error.message);

    return res.status(500).json({
      status: 'error',
      message: 'Unable to verify your session.',
    });
  }
});

// Administrator logout.
app.post('/api/admin/logout', requireAdmin, (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      console.error('Administrator logout failed:', error.message);

      return next(error);
    }

    res.clearCookie('express_car_wash_sid', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return res.json({
      status: 'success',
      message: 'Logged out successfully.',
    });
  });
});


// Get bookings for the authenticated administrator.
app.get('/api/admin/bookings', requireAdmin, async (req, res) => {
  try {
    const { date, status, search } = req.query;

    // Validate optional filters.
    if (date !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid date in YYYY-MM-DD format.',
      });
    }

    const allowedStatuses = [
      'pending',
      'confirmed',
      'completed',
      'cancelled',
    ];

    if (
      status !== undefined &&
      (typeof status !== 'string' ||
        !allowedStatuses.includes(status.toLowerCase()))
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid booking status filter.',
      });
    }

    if (
      search !== undefined &&
      (typeof search !== 'string' || search.trim().length > 100)
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Search must be 100 characters or fewer.',
      });
    }

    const conditions = [];
    const values = [];

    if (date) {
      values.push(date);
      conditions.push(`b.booking_date = $${values.length}::date`);
    }

    if (status) {
      values.push(status.toLowerCase());
      conditions.push(`LOWER(b.status) = $${values.length}`);
    }

    if (search && search.trim()) {
      values.push(`%${search.trim()}%`);
      const searchParameter = `$${values.length}`;

      conditions.push(`(
        c.full_name ILIKE ${searchParameter}
        OR c.phone ILIKE ${searchParameter}
        OR s.service_name ILIKE ${searchParameter}
        OR s.vehicle_type ILIKE ${searchParameter}
      )`);
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    const result = await pool.query(
      `SELECT
         b.booking_id,
         b.booking_date,
         b.booking_time,
         b.status,
         b.amount,
         b.notes,
         b.created_at,
         c.full_name AS customer_name,
         c.phone AS customer_phone,
         s.vehicle_type,
         s.service_name
       FROM bookings b
       INNER JOIN customers c
         ON b.customer_id = c.customer_id
       INNER JOIN services s
         ON b.service_id = s.service_id
       ${whereClause}
       ORDER BY
         b.booking_date DESC,
         b.booking_time DESC,
         b.booking_id DESC
       LIMIT 200`,
      values
    );

    return res.json({
      status: 'success',
      count: result.rows.length,
      bookings: result.rows,
    });
  } catch (error) {
    console.error('Error fetching admin bookings:', error.message);

    return res.status(500).json({
      status: 'error',
      message: 'Unable to retrieve bookings.',
    });
  }
});


// Update a booking's status and record its history.
// Administrator access required.
app.patch(
  '/api/admin/bookings/:id/status',
  requireAdmin,
  async (req, res) => {
    const bookingId = Number(req.params.id);
    const { status } = req.body;

    if (!Number.isSafeInteger(bookingId) || bookingId <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid booking ID.',
      });
    }

    const allowedStatuses = [
      'pending',
      'confirmed',
      'completed',
      'cancelled',
      'no_show',
    ];

    if (
      typeof status !== 'string' ||
      !allowedStatuses.includes(status.toLowerCase())
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid booking status.',
      });
    }

    const newStatus = status.toLowerCase();
    let client;
    let transactionStarted = false;

    try {
      client = await pool.connect();

      await client.query('BEGIN');
      transactionStarted = true;

      // Lock the booking so concurrent updates cannot overwrite each other.
      const bookingResult = await client.query(
        `SELECT booking_id, booking_date, booking_time, status, amount
         FROM bookings
         WHERE booking_id = $1
         FOR UPDATE`,
        [bookingId]
      );

      if (bookingResult.rows.length === 0) {
        await client.query('ROLLBACK');
        transactionStarted = false;

        return res.status(404).json({
          status: 'error',
          message: 'Booking not found.',
        });
      }

      const booking = bookingResult.rows[0];
      const oldStatus = String(booking.status).toLowerCase();

      // Do not allow a no-show status before the appointment time.
      if (newStatus === 'no_show') {
        const appointmentResult = await client.query(
          `SELECT
             ($1::date + $2::time)
             <= (CURRENT_TIMESTAMP AT TIME ZONE 'Africa/Nairobi')
             AS appointment_has_passed`,
          [booking.booking_date, booking.booking_time]
        );

        if (!appointmentResult.rows[0].appointment_has_passed) {
          await client.query('ROLLBACK');
          transactionStarted = false;

          return res.status(400).json({
            status: 'error',
            message: 'A booking cannot be marked as a no-show before its scheduled time.',
          });
        }
      }

      // Avoid unnecessary updates and duplicate history entries.
      if (oldStatus === newStatus) {
        await client.query('COMMIT');
        transactionStarted = false;

        return res.json({
          status: 'success',
          message: 'The booking already has this status.',
          booking,
        });
      }

      // Update the booking.
      const updateResult = await client.query(
        `UPDATE bookings
         SET status = $1
         WHERE booking_id = $2
         RETURNING
           booking_id,
           booking_date,
           booking_time,
           status,
           amount`,
        [newStatus, bookingId]
      );

      // Record the change in the same transaction.
      await client.query(
        `INSERT INTO booking_status_history
           (booking_id, old_status, new_status)
         VALUES ($1, $2, $3)`,
        [bookingId, oldStatus, newStatus]
      );

      await client.query('COMMIT');
      transactionStarted = false;

      return res.json({
        status: 'success',
        message: 'Booking status updated successfully.',
        booking: updateResult.rows[0],
      });
    } catch (error) {
      if (client && transactionStarted) {
        await client.query('ROLLBACK').catch(() => {});
      }

      console.error('Error updating booking status:', error.message);

      return res.status(500).json({
        status: 'error',
        message: 'Unable to update the booking status.',
      });
    } finally {
      if (client) {
        client.release();
      }
    }
  }
);

// Record a payment received by the business.
// Administrator access required.
app.post(
  '/api/admin/bookings/:id/payments',
  requireAdmin,
  async (req, res) => {
    const bookingId = Number(req.params.id);
    const { amount, payment_method, transaction_reference } = req.body;

    if (!Number.isSafeInteger(bookingId) || bookingId <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid booking ID.',
      });
    }

    // Accept a positive amount with no more than two decimal places.
    const amountString = String(amount ?? '');

    if (
      !/^\d+(\.\d{1,2})?$/.test(amountString) ||
      !Number.isFinite(Number(amountString)) ||
      Number(amountString) <= 0
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Enter a valid payment amount greater than zero.',
      });
    }

    const paymentAmount = Number(amountString);

    const allowedMethods = ['cash', 'mpesa', 'card', 'other'];

    if (
      typeof payment_method !== 'string' ||
      !allowedMethods.includes(payment_method.toLowerCase())
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Choose cash, M-PESA, card, or other.',
      });
    }

    const method = payment_method.toLowerCase();

    const reference =
      transaction_reference == null
        ? null
        : String(transaction_reference).trim() || null;

    if (reference && reference.length > 100) {
      return res.status(400).json({
        status: 'error',
        message: 'Transaction reference cannot exceed 100 characters.',
      });
    }

    let client;
    let transactionStarted = false;

    try {
      client = await pool.connect();

      await client.query('BEGIN');
      transactionStarted = true;

      // Lock this booking to prevent concurrent payment over-recording.
      const bookingResult = await client.query(
        `SELECT booking_id, amount, status
         FROM bookings
         WHERE booking_id = $1
         FOR UPDATE`,
        [bookingId]
      );

      if (bookingResult.rows.length === 0) {
        await client.query('ROLLBACK');
        transactionStarted = false;

        return res.status(404).json({
          status: 'error',
          message: 'Booking not found.',
        });
      }

      const booking = bookingResult.rows[0];
      const bookingStatus = String(booking.status).toLowerCase();

      if (['cancelled', 'no_show'].includes(bookingStatus)) {
        await client.query('ROLLBACK');
        transactionStarted = false;

        return res.status(400).json({
          status: 'error',
          message: 'Payments cannot be recorded for cancelled or no-show bookings.',
        });
      }

      // Only payments recorded as completed and actually received count.
      const totalsResult = await client.query(
        `SELECT COALESCE(SUM(amount), 0) AS total_paid
         FROM payments
         WHERE booking_id = $1
           AND LOWER(status) = 'completed'
           AND paid_at IS NOT NULL`,
        [bookingId]
      );

      const bookingAmount = Number(booking.amount);
      const totalPaid = Number(totalsResult.rows[0].total_paid);
      const remainingBalance = Math.max(0, bookingAmount - totalPaid);

      if (paymentAmount > remainingBalance + 0.000001) {
        await client.query('ROLLBACK');
        transactionStarted = false;

        return res.status(400).json({
          status: 'error',
          message: 'Payment exceeds the remaining balance.',
          booking_amount: bookingAmount,
          total_paid: totalPaid,
          remaining_balance: remainingBalance,
        });
      }

      // Record money that the owner has confirmed receiving.
      const paymentResult = await client.query(
        `INSERT INTO payments (
           booking_id,
           amount,
           payment_method,
           transaction_reference,
           status,
           paid_at,
           created_at
         )
         VALUES ($1, $2, $3, $4, 'completed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING
           payment_id,
           booking_id,
           amount,
           payment_method,
           transaction_reference,
           status,
           paid_at`,
        [bookingId, paymentAmount, method, reference]
      );

      const updatedTotal = totalPaid + paymentAmount;
      const updatedBalance = Math.max(0, bookingAmount - updatedTotal);

      await client.query('COMMIT');
      transactionStarted = false;

      return res.status(201).json({
        status: 'success',
        message: 'Payment recorded successfully.',
        payment: paymentResult.rows[0],
        booking_amount: bookingAmount,
        total_paid: updatedTotal,
        remaining_balance: updatedBalance,
        payment_status:
          updatedBalance <= 0.000001
            ? 'paid'
            : 'partially_paid',
      });
    } catch (error) {
      if (client && transactionStarted) {
        await client.query('ROLLBACK').catch(() => {});
      }

      console.error('Error recording payment:', error.message);

      return res.status(500).json({
        status: 'error',
        message: 'Unable to record the payment.',
      });
    } finally {
      if (client) {
        client.release();
      }
    }
  }
);


// Get dashboard statistics (administrator only).
app.get('/api/admin/dashboard-stats', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         COUNT(*)::INTEGER AS total_bookings,

         COUNT(*) FILTER (
           WHERE LOWER(status) = 'pending'
         )::INTEGER AS pending_bookings,

         COUNT(*) FILTER (
           WHERE LOWER(status) = 'confirmed'
         )::INTEGER AS confirmed_bookings,

         COUNT(*) FILTER (
           WHERE LOWER(status) = 'completed'
         )::INTEGER AS completed_bookings,

         COUNT(*) FILTER (
           WHERE LOWER(status) = 'cancelled'
         )::INTEGER AS cancelled_bookings,

         COUNT(*) FILTER (
           WHERE booking_date =
             (CURRENT_TIMESTAMP AT TIME ZONE 'Africa/Nairobi')::DATE
         )::INTEGER AS todays_bookings

       FROM bookings`
    );

    return res.json({
      status: 'success',
      stats: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error.message);

    return res.status(500).json({
      status: 'error',
      message: 'Unable to retrieve dashboard statistics.',
    });
  }
});

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

