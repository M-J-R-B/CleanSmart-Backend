const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { requireAuth } = require('../middleware/auth');

// Get all tasks
router.get('/', requireAuth, taskController.getTasks);

// Create a new task
router.post('/', requireAuth, taskController.createTask);

// Update task
router.put('/:taskId', requireAuth, taskController.updateTask);

// Generate tasks based on area and optional image
router.post('/generate', requireAuth, taskController.generateTasks);

module.exports = router; 