const express = require('express');
const router = express.Router();
const {
  getEmployees,
  addEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee 
} = require('../controllers/employeeController');

const upload  = require('../middleware/upload'); // Multer config for file uploads
const { body } = require('express-validator');
const { toggleEmployeeStatus } = require('../controllers/employeeController');

// PATCH update employee status
router.patch('/:id/status', toggleEmployeeStatus);

// GET all employees
router.get('/', getEmployees);

// POST a new employee
router.post(
  '/',
  upload.profilePic.single('profile_pic'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['employee', 'hr']).withMessage('Role must be either employee or hr'),
    body('department_id').isNumeric().withMessage('Department ID must be a number'),
    body('salaryAmount').isNumeric().withMessage('Salary amount must be a number'),
    body('salaryMonth').notEmpty().withMessage('Salary month is required'),
    body('salaryYear').isInt({ min: 2000 }).withMessage('Salary year must be valid')
  ],
  addEmployee
);

// GET a single employee by ID
router.get('/:id', getEmployeeById);

// PUT update employee details
router.put(
  '/:id',
  upload.profilePic.single('profile_pic'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('role').notEmpty().withMessage('Role must be employee or hr'),
    body('department_id').notEmpty().withMessage('Department is required')
  ],
  updateEmployee
);
router.delete('/:id', deleteEmployee);

module.exports = router;
