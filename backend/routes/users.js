const express = require('express');
const router = express.Router();

// TODO: Implement user management routes
router.get('/', (req, res) => {
  res.json({ message: 'Users route - to be implemented' });
});

module.exports = router; 