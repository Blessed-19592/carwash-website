require('dotenv').config();

const pool = require('./config/db');

async function testConnection() {
  try {
    const result = await pool.query(
      'SELECT current_database(), version()'
    );

    console.log('PostgreSQL connected successfully!');
    console.log('Database:', result.rows[0].current_database);
    console.log('Version:', result.rows[0].version);
  } catch (error) {
    console.error('Database connection failed:', error.message);
  } finally {
    await pool.end();
  }
}

testConnection();