const express = require('express');
const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const { ROLES } = require('../constants');

// Placeholder router for task‑related endpoints.
// Real task creation / update will replace this later.
const router = express.Router();

// Simple protected test route.
router.get(
  '/test',
  protect,
  authorize(ROLES.VOLUNTEER),
  (req, res) => {
    res.json({ message: 'Task route works' });
  }
);

module.exports = router;
