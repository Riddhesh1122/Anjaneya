const express = require('express');
const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const { ROLES } = require('../constants');

// Placeholder router for volunteer‑related endpoints.
// Real volunteer features (assignments, tasks, check‑in/out) will replace this later.
const router = express.Router();

// Example protected route to verify the router works.
router.get(
  '/test',
  protect,
  authorize(ROLES.VOLUNTEER),
  (req, res) => {
    res.json({ message: 'Volunteer route works' });
  }
);

module.exports = router;
