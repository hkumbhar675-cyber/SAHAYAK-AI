const express = require('express');
const router = express.Router();
const { store } = require('../db/db');

// GET /api/users - list demo citizen profiles
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      count: store.users.length,
      users: store.users
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/users/:id - get citizen profile
router.get('/:id', (req, res) => {
  try {
    const user = store.users.find(u => u.id === Number(req.params.id));
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
