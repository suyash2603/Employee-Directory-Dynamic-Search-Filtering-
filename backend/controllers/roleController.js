const db = require('../models/db');

exports.getAllRoles = async (req, res) => {
  try {
    const [roles] = await db.query('SELECT * FROM roles');
    res.status(200).json(roles);
  } catch (err) {
    console.error('Error fetching roles:', err);
    res.status(500).json({ message: 'Failed to fetch roles', error: err.message });
  }
};
