const db = require('../models/db');

exports.getDepartments = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM departments');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

exports.addDepartment = async (req, res) => {
  const { name } = req.body;
  try {
    await db.query('INSERT INTO departments (name) VALUES (?)', [name]);
    res.status(201).json({ message: 'Department added' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add department' });
  }
};
