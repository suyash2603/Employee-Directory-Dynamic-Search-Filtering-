const db = require("../models/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, phone, department_id, bio } = req.body;

    // Get the uploaded file name
    const profilePicPath = req.file ? req.file.filename : null;

    if (!name || !email || !password || !role || !department_id) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generating a unique 6-digit employee ID
    let employeeId;
    let isUnique = false;
    while (!isUnique) {
      employeeId = Math.floor(100000 + Math.random() * 900000);
      const [existing] = await db.query(
        "SELECT id FROM employees WHERE id = ?",
        [employeeId]
      );
      if (existing.length === 0) isUnique = true;
    }

    // Step 1: Insert into employees table
    await db.query(
      `INSERT INTO employees (id, name, email, password, phone, department_id, bio, profile_pic) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        employeeId,
        name,
        email,
        hashedPassword,
        phone,
        department_id,
        bio || "",
        profilePicPath,
      ]
    );

    // Step 2: Get role ID from roles table
    const [roleRows] = await db.query(
      `SELECT id FROM roles WHERE role_name = ?`,
      [role]
    );

    if (roleRows.length === 0) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    const roleId = roleRows[0].id;

    // Step 3: Insert into employee_roles table
    await db.query(
      `INSERT INTO employee_roles (employee_id, role_id) VALUES (?, ?)`,
      [employeeId, roleId]
    );

    res.status(201).json({ message: "Signup successful", employeeId });
  } catch (err) {
    console.error("❌ Signup Error:", err);
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email and new password are required" });
  }

  try {
    // Check if the user exists
    const [rows] = await db.query("SELECT * FROM employees WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the DB
    const [updateResult] = await db.query(
      "UPDATE employees SET password = ? WHERE email = ?",
      [hashedPassword, email]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(500).json({ message: "Failed to update the password" });
    }

    // Generate a new JWT token after password reset
    const user = rows[0]; // Get the user data after password change
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({ message: "Password updated successfully", token });
  } catch (error) {
    console.error("Password Reset Error:", error);
    res.status(500).json({ message: "Server error", details: error.message });
  }
};

//Login
exports.login = async (req, res) => {
  const { email, password, selectedRole } = req.body;

  try {
    // 1. Fetch employee by email
    const [employeeRows] = await db.query(
      'SELECT * FROM employees WHERE email = ? AND status = "active"',
      [email]
    );

    if (employeeRows.length === 0) {
      return res
        .status(404)
        .json({ message: "Employee not found or inactive" });
    }

    const employee = employeeRows[0];

    // 2. Safeguard: Ensure password exists
    if (!employee.password) {
      return res
        .status(400)
        .json({ message: "No password found for this user." });
    }

    // 3. Compare passwords
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 4. Get all roles for this user
    const [roleRows] = await db.query(
      `SELECT r.role_name 
   FROM employee_roles er
   JOIN roles r ON er.role_id = r.id
   WHERE er.employee_id = ?`,
      [employee.id]
    );

    // Map roles
    let roles = roleRows.map((r) => r.role_name);

    // ✅ Add "employee" role by default
    if (!roles.includes("employee")) {
      roles.push("employee");
    }

    // ✅ Validate selectedRole
    if (
      selectedRole &&
      !roles.map((r) => r.toLowerCase()).includes(selectedRole.toLowerCase())
    ) {
      return res
        .status(403)
        .json({ message: `User is not authorized as ${selectedRole}` });
    }

    // 6. Generate JWT with all roles
    const token = jwt.sign(
      { id: employee.id, roles },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1d" }
    );

    // 7. Return user info along with selected role
    res.json({
      token,
      user: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        department_id: employee.department_id,
        profile_pic: employee.profile_pic,
        roles,
        selectedRole: selectedRole, // Ensure selectedRole is set correctly
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

//checkCredentials
exports.checkCredentials = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM employees WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Credentials valid" });
  } catch (error) {
    console.error("Credential check error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
