const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController'); // Correct path

router.get('/', roleController.getAllRoles);

module.exports = router;
