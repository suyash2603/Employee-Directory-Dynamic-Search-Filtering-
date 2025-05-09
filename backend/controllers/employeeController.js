const db = require('../models/db');
const bcrypt = require('bcrypt');
const generateEmployeeId = async () => {
    let isUnique = false;
    let employeeId;
  
    while (!isUnique) {
      employeeId = Math.floor(100000 + Math.random() * 900000);
      const [rows] = await db.query('SELECT id FROM employees WHERE id = ?', [employeeId]);
      if (rows.length === 0) isUnique = true;
    }
  
    return employeeId;
  };
  

// GET all employees (optionally filtered by status)
exports.getEmployees = async (req, res) => {
  const { status } = req.query;
  let query = `
    SELECT e.*, d.name AS department_name, r.role_name AS role
    FROM employees e
    JOIN departments d ON e.department_id = d.id
    LEFT JOIN employee_roles er ON e.id = er.employee_id
    LEFT JOIN roles r ON er.role_id = r.id
  `;
  const values = [];

  if (status) {
    query += ' WHERE e.status = ?';
    values.push(status);
  }

  try {
    const [rows] = await db.query(query, values);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
};

// GET employee by ID
exports.getEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT e.*, d.name AS department_name, r.role_name AS role
      FROM employees e
      JOIN departments d ON e.department_id = d.id
      LEFT JOIN employee_roles er ON e.id = er.employee_id
      LEFT JOIN roles r ON er.role_id = r.id
      WHERE e.id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching employee:", err);
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
};

// ADD employee
exports.addEmployee = async (req, res) => {
    const {
      name, email, password, phone, bio, role, department_id,
      salaryAmount, salaryMonth, salaryYear, status = 'active'
    } = req.body;
  
    const profile_pic = req.file?.filename ?? null;
  
    const connection = await db.getConnection();
  
    try {
      await connection.beginTransaction();
  
      const employeeId = await generateEmployeeId();
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      await connection.execute(
        `INSERT INTO employees (id, name, email, password, phone, bio, department_id, profile_pic, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          employeeId,
          name,
          email,
          hashedPassword,
          phone ?? null,
          bio ?? null,
          department_id,
          profile_pic,
          status
        ]
      );
      const [roleResult]=await connection.execute(
        'SELECT id FROM roles WHERE role_name=?',
        [role]
      );
      if (!roleResult.length) {
        throw new Error(`Invalid role: ${role}`);
      }
  
      const roleId = roleResult[0].id;
      await connection.execute(
        'INSERT INTO employee_roles (employee_id, role_id) VALUES (?, ?)',
        [employeeId, roleId]
      );
  
      await connection.execute(
        `INSERT INTO salary_slips (employee_id, amount, month, year)
         VALUES (?, ?, ?, ?)`,
        [
          employeeId,
          salaryAmount ?? null,
          salaryMonth ?? null,
          salaryYear ?? null
        ]
      );
  
      await connection.commit();
  
      res.status(201).json({ message: 'Employee and salary added successfully', id: employeeId });
  
    } catch (err) {
      await connection.rollback();
      console.error("Error adding employee and salary:", err);
      res.status(500).json({ error: 'Failed to add employee and salary' });
    } finally {
      connection.release();
    }
  };
  
// UPDATE employee
exports.updateEmployee = async (req, res) => {
  const employeeId = req.params.id;
  const {
    name,
    email,
    phone,
    role,
    department_id,
    salaryAmount,
    salaryMonth,
    salaryYear,
  } = req.body;

  const sanitize = (value) => (value === undefined ? null : value);

  try {
    const conn = await db.getConnection();

    // Start transaction
    await conn.beginTransaction();

    // Update employee table
    const updateEmployeeQuery = `
      UPDATE employees
      SET name = ?, email = ?, phone = ?, department_id = ?, role = ?
      WHERE id = ?
    `;
    const employeeValues = [
      sanitize(name),
      sanitize(email),
      sanitize(phone),
      sanitize(department_id),
      sanitize(role),
      employeeId
    ];

    await conn.execute(updateEmployeeQuery, employeeValues);

    // Update salary if new data is provided
    const [existingSalary] = await conn.execute(
      `SELECT id FROM salary_slips WHERE employee_id = ? AND month = ? AND year = ?`,
      [employeeId, sanitize(salaryMonth), sanitize(salaryYear)]
    );

    if (existingSalary.length > 0) {
      // Update existing salary slip
      const updateSalaryQuery = `
        UPDATE salary_slips
        SET amount = ?
        WHERE employee_id = ? AND month = ? AND year = ?
      `;
      const salaryValues = [
        sanitize(salaryAmount),
        employeeId,
        sanitize(salaryMonth),
        sanitize(salaryYear)
      ];
      await conn.execute(updateSalaryQuery, salaryValues);
    } else if (salaryAmount && salaryMonth && salaryYear) {
      // Insert new salary slip if no existing data found
      const insertSalaryQuery = `
        INSERT INTO salary_slips (employee_id, amount, month, year)
        VALUES (?, ?, ?, ?)
      `;
      const salaryValues = [
        employeeId,
        sanitize(salaryAmount),
        sanitize(salaryMonth),
        sanitize(salaryYear)
      ];
      await conn.execute(insertSalaryQuery, salaryValues);
    }

    // Commit transaction
    await conn.commit();

    res.json({ message: 'Employee updated successfully!' });
  } catch (err) {
    // Rollback transaction in case of an error
    await conn.rollback();
    console.error('Error updating employee:', err);
    res.status(500).json({ message: 'Failed to update employee' });
  }
};

// TOGGLE status
exports.toggleEmployeeStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT status FROM employees WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const currentStatus = rows[0].status;
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    await db.query('UPDATE employees SET status = ? WHERE id = ?', [newStatus, id]);
    res.json({ message: `Employee status updated to ${newStatus}` });
  } catch (err) {
    console.error('Error toggling employee status:', err);
    res.status(500).json({ error: 'Failed to toggle employee status' });
  }
};

// GET profile
exports.getProfile = async (req, res) => {
  const { id } = req.user;
  try {
    const [rows] = await db.query(`
      SELECT e.*, d.name AS department_name, r.role_name AS role
      FROM employees e
      JOIN departments d ON e.department_id = d.id
      LEFT JOIN employee_roles er ON e.id = er.employee_id
      LEFT JOIN roles r ON er.role_id = r.id
      WHERE e.id = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};
// DELETE employee
exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Delete from salary_slips first due to foreign key constraints
    await connection.query('DELETE FROM salary_slips WHERE employee_id = ?', [id]);

    // Delete from employee_roles table
    await connection.query('DELETE FROM employee_roles WHERE employee_id = ?', [id]);

    // Delete the employee
    const [result] = await connection.query('DELETE FROM employees WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Employee not found' });
    }

    await connection.commit();
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    await connection.rollback();
    console.error('Error deleting employee:', err);
    res.status(500).json({ error: 'Failed to delete employee' });
  } finally {
    connection.release();
  }
};
