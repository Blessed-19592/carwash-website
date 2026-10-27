const bcrypt = require('bcrypt');
const prompt = require('prompt-sync')({
  sigint: true,
  eot: true,
});

require('dotenv').config();

const pool = require('./config/db');

async function createAdmin() {
  try {
    console.log('\n=== Express Car Wash Admin Setup ===\n');

    // Check whether an administrator already exists.
    const existingAdmin = await pool.query(
      'SELECT admin_id FROM admin_users LIMIT 1'
    );

    if (existingAdmin.rows.length > 0) {
      console.log(
        'An administrator account already exists. Setup stopped.'
      );
      return;
    }

    // Collect administrator details.
    const fullName = prompt('Owner full name: ').trim();
    const email = prompt('Owner email address: ')
      .trim()
      .toLowerCase();

    const password = prompt('Create a password: ', {
      echo: '',
    });

    const confirmPassword = prompt('Confirm password: ', {
      echo: '',
    });

    // Validate the inputs.
    if (!fullName || fullName.length > 100) {
      console.log('Please enter a valid name.');
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 255
    ) {
      console.log('Please enter a valid email address.');
      return;
    }

    if (password.length < 12) {
      console.log('Your password must contain at least 12 characters.');
      return;
    }

    if (password !== confirmPassword) {
      console.log('The passwords do not match.');
      return;
    }

    // Hash the password before storing it.
    const passwordHash = await bcrypt.hash(password, 12);

    // Create the administrator account.
    await pool.query(
      `INSERT INTO admin_users (
         full_name,
         email,
         password_hash
       )
       VALUES ($1, $2, $3)`,
      [fullName, email, passwordHash]
    );

    console.log('\nAdministrator account created successfully!');
    console.log('Keep your login credentials secure.');
  } catch (error) {
    console.error(
      'Administrator setup failed:',
      error.message
    );
  } finally {
    await pool.end();
  }
}

createAdmin();