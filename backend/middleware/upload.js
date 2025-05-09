// middleware/upload.js
const multer = require('multer');
const path = require('path');

// Filter only PDF files
const fileFilterPDF = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== '.pdf') {
    return cb(new Error('Only PDF files are allowed'), false);
  }
  cb(null, true);
};

// Storage for profile picture
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, 'profile_' + Date.now() + path.extname(file.originalname)),
});

// Storage for salary slip
const salarySlipStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, 'salary_' + Date.now() + path.extname(file.originalname)),
});

const upload = {
  profilePic: multer({ storage: profileStorage }),
  salarySlip: multer({
    storage: salarySlipStorage,
    fileFilter: fileFilterPDF,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  }),
};

module.exports = upload;
