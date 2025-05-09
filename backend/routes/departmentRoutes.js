const express = require("express");
const router = express.Router();
const db = require("../models/db");

// GET all departments
router.get("/", async (req, res) => {
  try {
    const [departments] = await db.query("SELECT id, name FROM departments");
    res.json(departments); // Make sure this sends array of departments
  } catch (err) {
    console.error("Error fetching departments", err);
    res.status(500).json({ error: "Failed to fetch departments" });
  }
});

module.exports = router;
