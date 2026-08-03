const express = require('express');
const protect = require('../middleware/auth.middleware');
const { taskController } = require('../controllers');

const router = express.Router();

router.get('/', protect, taskController.getTasks);
router.get('/:id', protect, taskController.getTaskById);
router.post('/', protect, taskController.createTask);
router.put('/:id', protect, taskController.updateTask);
router.delete('/:id', protect, taskController.deleteTask);

module.exports = router;
