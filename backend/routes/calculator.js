const express = require('express');
const router = express.Router();
const { calculateAssistance } = require('../services/calculatorService');

// POST /api/calculator - compute financial assistance and EMI
router.post('/', (req, res) => {
  try {
    const {
      loanAmount = 100000,
      subsidyPct = 0,
      annualInterestRate = 8.5,
      tenureMonths = 36
    } = req.body;

    const result = calculateAssistance({
      loanAmount,
      subsidyPct,
      annualInterestRate,
      tenureMonths
    });

    res.json({
      success: true,
      calculation: result
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
