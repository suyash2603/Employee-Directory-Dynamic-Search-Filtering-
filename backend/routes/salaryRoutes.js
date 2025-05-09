const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salaryController');

router.post('/generate-salary-slip', salaryController.generateSalarySlip);
router.get('/salary-slips/:employee_id', salaryController.getSalarySlips);

module.exports = router;