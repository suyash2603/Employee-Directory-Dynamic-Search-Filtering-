// backend/testDB.js

const db = require('./models/db');

async function testConnection() {
  try {
    const [result] = await db.query('SELECT 1 + 1 AS solution');
    console.log('✅ MySQL Connected. Result:', result[0].solution);
  } catch (error) {
    console.error('❌ Connection Failed:', error.message);
  }
}

testConnection();
