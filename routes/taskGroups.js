const express = require('express');
const router = express.Router();
const taskGroupController = require('../controllers/taskGroupController');
const { requireAuth } = require('../middleware/auth');
const TaskGroup = require('../models/TaskGroup');
const mongoose = require('mongoose');

// Get all task groups
router.get('/', requireAuth, taskGroupController.getTaskGroups);

// Get task groups for a specific user
router.get('/:userId', requireAuth, taskGroupController.getUserTaskGroups);

// Create a new task group
router.post('/', requireAuth, taskGroupController.saveTaskGroup);

// Update task group progress
router.put('/:taskGroupId', requireAuth, taskGroupController.updateTaskGroupProgress);

// TEST ENDPOINT - Create task group without auth
router.post('/test', async (req, res) => {
  try {
    console.log('Test endpoint called with body:', JSON.stringify(req.body, null, 2));
    const { taskGroup } = req.body;
    
    if (!taskGroup || !taskGroup.areaName) {
      console.error('Missing taskGroup or areaName in request body');
      return res.status(400).json({
        success: false,
        message: 'Task group with area name is required'
      });
    }
    
    console.log(`Task group details - Area Name: ${taskGroup.areaName}`);
    console.log(`Task group image size: ${taskGroup.imageBase64 ? taskGroup.imageBase64.length : 0} bytes`);
    console.log(`Task group tasks: ${JSON.stringify(taskGroup.tasks)}`);
    
    // Create a new task group with a dummy user ID since we're bypassing auth
    const newTaskGroup = new TaskGroup({
      userId: mongoose.Types.ObjectId('000000000000000000000000'), // Dummy ID
      areaName: taskGroup.areaName,
      imageBase64: taskGroup.imageBase64 || null,
      tasks: taskGroup.tasks || [],
      progress: taskGroup.progress || 0,
      dateCreated: taskGroup.dateCreated || Date.now()
    });
    
    console.log('About to save task group:', JSON.stringify({
      userId: newTaskGroup.userId,
      areaName: newTaskGroup.areaName,
      imageBase64: newTaskGroup.imageBase64 ? `${newTaskGroup.imageBase64.substring(0, 30)}... (${newTaskGroup.imageBase64.length} bytes)` : null,
      tasks: newTaskGroup.tasks,
      progress: newTaskGroup.progress,
      dateCreated: newTaskGroup.dateCreated
    }, null, 2));
    
    const savedTaskGroup = await newTaskGroup.save();
    console.log('Task group saved:', JSON.stringify({
      id: savedTaskGroup._id,
      areaName: savedTaskGroup.areaName,
      hasImage: !!savedTaskGroup.imageBase64,
      imageSize: savedTaskGroup.imageBase64 ? savedTaskGroup.imageBase64.length : 0,
      tasks: savedTaskGroup.tasks,
      progress: savedTaskGroup.progress
    }, null, 2));
    
    return res.status(201).json({
      success: true,
      message: 'Task group saved successfully via test endpoint',
      taskGroup: {
        id: savedTaskGroup._id,
        userId: savedTaskGroup.userId.toString(),
        areaName: savedTaskGroup.areaName,
        imageBase64: savedTaskGroup.imageBase64,
        tasks: savedTaskGroup.tasks,
        progress: savedTaskGroup.progress,
        dateCreated: savedTaskGroup.dateCreated
      }
    });
  } catch (error) {
    console.error('Error in test endpoint:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in test endpoint',
      error: error.message,
      stack: error.stack
    });
  }
});

// SIMPLE TEST ENDPOINT - Create task group with direct parameters
router.post('/simple-test', async (req, res) => {
  try {
    console.log('Simple test endpoint called with body:', JSON.stringify(req.body, null, 2));
    const { areaName, tasks } = req.body;
    
    if (!areaName) {
      return res.status(400).json({
        success: false,
        message: 'Area name is required'
      });
    }
    
    // Create a new task group with direct parameters
    const newTaskGroup = new TaskGroup({
      userId: mongoose.Types.ObjectId('000000000000000000000000'), // Dummy ID
      areaName: areaName,
      tasks: tasks || [],
      progress: 0,
      dateCreated: Date.now()
    });
    
    console.log('About to save simple task group:', JSON.stringify({
      userId: newTaskGroup.userId,
      areaName: newTaskGroup.areaName,
      tasks: newTaskGroup.tasks,
      progress: newTaskGroup.progress,
      dateCreated: newTaskGroup.dateCreated
    }, null, 2));
    
    const savedTaskGroup = await newTaskGroup.save();
    console.log('Simple task group saved:', JSON.stringify({
      id: savedTaskGroup._id,
      areaName: savedTaskGroup.areaName,
      tasks: savedTaskGroup.tasks,
      progress: savedTaskGroup.progress
    }, null, 2));
    
    return res.status(201).json({
      success: true,
      message: 'Task group saved successfully via simple test endpoint',
      taskGroup: {
        id: savedTaskGroup._id,
        areaName: savedTaskGroup.areaName,
        tasks: savedTaskGroup.tasks,
        progress: savedTaskGroup.progress,
        dateCreated: savedTaskGroup.dateCreated
      }
    });
  } catch (error) {
    console.error('Error in simple test endpoint:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in simple test endpoint',
      error: error.message,
      stack: error.stack
    });
  }
});

module.exports = router; 