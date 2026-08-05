const express = require('express');
const { createUserSchema, userIdParamsSchema } = require('../validators');
const { validateBody, validateParams } = require('../middleware/validateRequest');
const { userController } = require('../controllers');

const router = express.Router();

router.post('/', validateBody(createUserSchema), userController.createUser);
router.get('/', userController.getUsers);
router.get('/:id', validateParams(userIdParamsSchema), userController.getUserById);

module.exports = router;