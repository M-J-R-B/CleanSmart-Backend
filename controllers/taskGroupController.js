const TaskGroup = require('../models/TaskGroup');
const mongoose = require('mongoose');

// Get all task groups for a user
exports.getTaskGroups = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user is attached by auth middleware
    const taskGroups = await TaskGroup.find({ userId });
    
    return res.status(200).json({
      success: true,
      taskGroups: taskGroups.map(tg => ({
        id: tg._id.toString(),
        userId: tg.userId.toString(),
        areaName: tg.areaName,
        imageBase64: tg.imageBase64,
        tasks: tg.tasks,
        progress: tg.progress,
        dateCreated: tg.dateCreated
      }))
    });
  } catch (error) {
    console.error('Error fetching task groups:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get task groups for a specific user
exports.getUserTaskGroups = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Make sure the requesting user can only access their own data or admin check
    if (req.user._id.toString() !== userId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access these task groups'
      });
    }
    
    const taskGroups = await TaskGroup.find({ userId: mongoose.Types.ObjectId(userId) });
    
    return res.status(200).json({
      success: true,
      taskGroups: taskGroups.map(tg => ({
        id: tg._id.toString(),
        userId: tg.userId.toString(),
        areaName: tg.areaName,
        imageBase64: tg.imageBase64,
        tasks: tg.tasks,
        progress: tg.progress,
        dateCreated: tg.dateCreated
      }))
    });
  } catch (error) {
    console.error('Error fetching user task groups:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create a new task group
exports.saveTaskGroup = async (req, res) => {
  try {
    console.log('Save task group called with body structure:', JSON.stringify({
      hasTaskGroup: !!req.body.taskGroup,
      bodyKeys: Object.keys(req.body)
    }, null, 2));
    
    const { taskGroup } = req.body;
    
    if (!taskGroup || !taskGroup.areaName) {
      console.error('Missing taskGroup or areaName in request');
      return res.status(400).json({
        success: false,
        message: 'Task group with area name is required'
      });
    }
    
    console.log(`Task group details - Area Name: ${taskGroup.areaName}`);
    console.log(`Task group image size: ${taskGroup.imageBase64 ? taskGroup.imageBase64.length : 0} bytes`);
    console.log(`Task group tasks count: ${taskGroup.tasks ? taskGroup.tasks.length : 0}`);
    
    // Use the authenticated user's ID
    const userId = req.user._id;
    
    // Create a new task group
    const newTaskGroup = new TaskGroup({
      userId,
      areaName: taskGroup.areaName,
      imageBase64: taskGroup.imageBase64 || null,
      tasks: taskGroup.tasks || [],
      progress: taskGroup.progress || 0,
      dateCreated: taskGroup.dateCreated || Date.now()
    });
    
    console.log('About to save task group with the following structure:', JSON.stringify({
      userId: newTaskGroup.userId.toString(),
      areaName: newTaskGroup.areaName,
      hasImage: !!newTaskGroup.imageBase64,
      imageSize: newTaskGroup.imageBase64 ? newTaskGroup.imageBase64.length : 0,
      tasksCount: newTaskGroup.tasks.length,
      progress: newTaskGroup.progress,
      dateCreated: newTaskGroup.dateCreated
    }, null, 2));
    
    const savedTaskGroup = await newTaskGroup.save();
    
    console.log('Task group saved successfully with ID:', savedTaskGroup._id.toString());
    
    return res.status(201).json({
      success: true,
      taskGroup: {
        id: savedTaskGroup._id.toString(),
        userId: savedTaskGroup.userId.toString(),
        areaName: savedTaskGroup.areaName,
        imageBase64: savedTaskGroup.imageBase64,
        tasks: savedTaskGroup.tasks,
        progress: savedTaskGroup.progress,
        dateCreated: savedTaskGroup.dateCreated
      }
    });
  } catch (error) {
    console.error('Error creating task group:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
      stack: error.stack
    });
  }
};

// Update task group progress
exports.updateTaskGroupProgress = async (req, res) => {
  try {
    const { taskGroupId } = req.params;
    const { progress } = req.body;
    
    if (progress === undefined || progress === null) {
      return res.status(400).json({
        success: false,
        message: 'Progress value is required'
      });
    }
    
    // Find the task group
    const taskGroup = await TaskGroup.findById(taskGroupId);
    
    if (!taskGroup) {
      return res.status(404).json({
        success: false,
        message: 'Task group not found'
      });
    }
    
    // Check if user owns the task group
    if (taskGroup.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task group'
      });
    }
    
    // Update task group progress
    taskGroup.progress = progress;
    const updatedTaskGroup = await taskGroup.save();
    
    return res.status(200).json({
      success: true,
      taskGroup: {
        id: updatedTaskGroup._id.toString(),
        userId: updatedTaskGroup.userId.toString(),
        areaName: updatedTaskGroup.areaName,
        imageBase64: updatedTaskGroup.imageBase64,
        tasks: updatedTaskGroup.tasks,
        progress: updatedTaskGroup.progress,
        dateCreated: updatedTaskGroup.dateCreated
      }
    });
  } catch (error) {
    console.error('Error updating task group progress:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}; 