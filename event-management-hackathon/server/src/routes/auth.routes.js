const express = require('express');
const { registerSchema, loginSchema } = require('../validators');
const { validateBody } = require('../middleware/validateRequest');
const protect = require('../middleware/auth.middleware');
const { authController } = require('../controllers');

const router = express.Router();

router.post('/signup', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);
router.get('/me', protect, authController.getMe);

module.exports = router;