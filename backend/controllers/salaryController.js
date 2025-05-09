const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const db = require('../models/db');

// Generate salary slip PDF
exports.generateSalarySlip = async (req, res) => {
    try {
      const { employee_id, month, year, amount } = req.body;
  
      // Get employee name from database
      const [employeeRows] = await db.query(
        'SELECT name FROM employees WHERE id = ?',
        [employee_id]
      );
  
      if (employeeRows.length === 0) {
        return res.status(404).json({ error: 'Employee not found' });
      }
  
      const { id, name: employeeName, email } = employeeRows[0];
  
      // Create salary_slips folder if it doesn't exist
      const outputDir = path.join(__dirname, '../uploads/salary_slips');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
  
      // Create the PDF file
      const fileName = `${employeeName.replace(/\s/g, '_')}_${month}_${year}.pdf`;
      const filePath = path.join(outputDir, fileName);
  
      const doc = new PDFDocument();
      doc.pipe(fs.createWriteStream(filePath));
  
      doc.fontSize(18).text('Salary Slip', { align: 'center' });
      doc.moveDown();
      
      doc.fontSize(12).text(`Employee ID: ${id}`);
    doc.text(`Name: ${employeeName}`);
    doc.text(`Email: ${email}`);
    doc.text(`Month: ${month}`);
    doc.text(`Year: ${year}`);
    doc.text(`Amount: ₹${amount}`);
    doc.text(`Date Issued: ${new Date().toLocaleDateString()}`);

    doc.end();
  
      // Optionally insert the record into salary_slips table
      await db.query(
        'INSERT INTO salary_slips (employee_id, month, year, amount, file_path) VALUES (?, ?, ?, ?, ?)',
        [employee_id, month, year, amount, `salary_slips/${fileName}`] // remove leading "uploads/"

      );
  
      res.json({ message: 'Salary slip generated successfully' });
    } catch (err) {
      console.error('Error generating salary slip:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Get salary slips for an employee
exports.getSalarySlips = async (req, res) => {
  try {
    const { employee_id } = req.params;
    const [slips] = await db.query(
      'SELECT * FROM salary_slips WHERE employee_id = ?',
      [employee_id]
    );
    res.status(200).json(slips);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch slips', error: err });
  }
};
