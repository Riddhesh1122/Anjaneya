const express = require('express');
const { createTaskSchema, updateTaskSchema } = require('../validators');
const { validateBody } = require('../middleware/validateRequest');
const protect = require('../middleware/auth.middleware');
const { taskController } = require('../controllers');

const router = express.Router();

router.get('/', taskController.getTasks);
router.post('/', protect, validateBody(createTaskSchema), taskController.createTask);
router.put('/:id', protect, validateBody(updateTaskSchema), taskController.updateTask);
router.delete('/:id', protect, taskController.deleteTask);

module.exports = router;
