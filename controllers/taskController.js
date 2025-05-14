const Task = require('../models/Task');

// Get all tasks for a user
exports.getTasks = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user is attached by auth middleware
    const tasks = await Task.find({ userId });
    
    return res.status(200).json(
      tasks.map(task => ({
        id: task._id.toString(),
        title: task.title,
        description: task.description,
        area: task.area,
        priority: task.priority,
        isCompleted: task.isCompleted,
        createdAt: task.createdAt
      }))
    );
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const taskData = req.body;
    // Add the userId from authenticated user
    const userId = req.user._id;
    
    const newTask = new Task({
      title: taskData.title,
      description: taskData.description,
      area: taskData.area,
      priority: taskData.priority || 'MEDIUM',
      isCompleted: taskData.isCompleted || false,
      userId
    });
    
    const savedTask = await newTask.save();
    
    return res.status(201).json({
      id: savedTask._id.toString(),
      title: savedTask.title,
      description: savedTask.description,
      area: savedTask.area,
      priority: savedTask.priority,
      isCompleted: savedTask.isCompleted,
      createdAt: savedTask.createdAt
    });
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const taskData = req.body;
    const userId = req.user._id; // Assuming user is attached by auth middleware
    
    // Find the task first
    const task = await Task.findById(taskId);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Check if user owns the task
    if (task.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }
    
    // Update task
    if (taskData.title) task.title = taskData.title;
    if (taskData.description !== undefined) task.description = taskData.description;
    if (taskData.area) task.area = taskData.area;
    if (taskData.priority) task.priority = taskData.priority;
    if (taskData.isCompleted !== undefined) task.isCompleted = taskData.isCompleted;
    
    const updatedTask = await task.save();
    
    return res.status(200).json({
      id: updatedTask._id.toString(),
      title: updatedTask.title,
      description: updatedTask.description,
      area: updatedTask.area,
      priority: updatedTask.priority,
      isCompleted: updatedTask.isCompleted,
      createdAt: updatedTask.createdAt
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Generate tasks based on area and image
exports.generateTasks = async (req, res) => {
  try {
    const { area, imageBase64 } = req.body;
    const userId = req.user._id;
    
    if (!area) {
      return res.status(400).json({
        success: false,
        message: 'Area name is required'
      });
    }
    
    // For now, we'll generate some placeholder tasks based on the area
    // In a real implementation, you might use AI to analyze the image
    // and generate appropriate tasks
    
    const areaTaskMap = {
      'kitchen': [
        { title: 'Clean countertops', description: 'Wipe down all countertops', priority: 'HIGH' },
        { title: 'Wash dishes', description: 'Clean all dirty dishes', priority: 'HIGH' },
        { title: 'Sweep floor', description: 'Sweep the kitchen floor', priority: 'MEDIUM' },
        { title: 'Take out trash', description: 'Empty the kitchen trash bin', priority: 'MEDIUM' }
      ],
      'bathroom': [
        { title: 'Clean toilet', description: 'Clean toilet bowl and seat', priority: 'HIGH' },
        { title: 'Clean shower', description: 'Clean shower walls and floor', priority: 'HIGH' },
        { title: 'Clean sink', description: 'Clean sink and faucet', priority: 'MEDIUM' },
        { title: 'Mop floor', description: 'Mop the bathroom floor', priority: 'MEDIUM' }
      ],
      'bedroom': [
        { title: 'Make bed', description: 'Make the bed neatly', priority: 'MEDIUM' },
        { title: 'Dust surfaces', description: 'Dust all surfaces', priority: 'LOW' },
        { title: 'Organize clothes', description: 'Put away clothes and organize closet', priority: 'MEDIUM' },
        { title: 'Vacuum floor', description: 'Vacuum the bedroom floor', priority: 'MEDIUM' }
      ],
      'living room': [
        { title: 'Dust surfaces', description: 'Dust all surfaces', priority: 'MEDIUM' },
        { title: 'Vacuum floor', description: 'Vacuum the living room floor', priority: 'MEDIUM' },
        { title: 'Organize items', description: 'Organize any items out of place', priority: 'LOW' },
        { title: 'Clean windows', description: 'Clean the windows', priority: 'LOW' }
      ]
    };
    
    // Default tasks if area doesn't match
    const defaultTasks = [
      { title: 'Clean surfaces', description: 'Clean all surfaces in the area', priority: 'MEDIUM' },
      { title: 'Organize items', description: 'Organize items in the area', priority: 'MEDIUM' },
      { title: 'Clean floor', description: 'Clean the floor', priority: 'MEDIUM' }
    ];
    
    // Normalize area name to lowercase for matching
    const normalizedArea = area.toLowerCase();
    const taskTemplates = areaTaskMap[normalizedArea] || defaultTasks;
    
    // Create actual task objects
    const generatedTasks = [];
    for (const template of taskTemplates) {
      const task = new Task({
        title: template.title,
        description: template.description,
        area: area,
        priority: template.priority,
        isCompleted: false,
        userId
      });
      
      const savedTask = await task.save();
      generatedTasks.push({
        id: savedTask._id.toString(),
        title: savedTask.title,
        description: savedTask.description,
        area: savedTask.area,
        priority: savedTask.priority,
        isCompleted: savedTask.isCompleted,
        createdAt: savedTask.createdAt
      });
    }
    
    return res.status(200).json({
      success: true,
      message: `Generated ${generatedTasks.length} tasks for ${area}`,
      tasks: generatedTasks
    });
  } catch (error) {
    console.error('Error generating tasks:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}; 