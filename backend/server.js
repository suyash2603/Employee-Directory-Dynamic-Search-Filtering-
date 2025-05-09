// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const roleRoutes = require('./routes/roleRoutes');
const salaryRoutes = require('./routes/salaryRoutes');

const app = express();

// ✅ Enable CORS for frontend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// ✅ Parse JSON bodies
app.use(express.json());

// ✅ Ensure uploads directory exists
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// ✅ Serve static files from /uploads
app.use('/uploads', express.static(uploadPath));

// ✅ Use routes
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);

app.use('/api/roles', roleRoutes);
app.use('/api', salaryRoutes);
app.use('/salary_slips', express.static(path.join(__dirname, 'salary_slips')));
// ✅ Health check
app.get('/', (req, res) => {
  res.send('API is running');
});

// ✅ Start server
const PORT = process.env.PORT || 8000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app; // ✅ Export app for Supertest
