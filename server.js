const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const User = require('./models/User');
const Task = require('./models/Task');
const TaskGroup = require('./models/TaskGroup');

// Load environment variables
dotenv.config();

// Debug: Check if environment variables are loaded
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('PORT:', process.env.PORT);

// Import routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const taskGroupRoutes = require('./routes/taskGroups');

const app = express();

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Request Headers:', req.headers);
  // Don't log request body here as it could be very large with images
  next();
});

// Middleware
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Increase the payload size limit for base64 images
// 50MB should be enough for most images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Connect to MongoDB
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env file');
  process.exit(1);
}

// Set mongoose debug mode
mongoose.set('debug', true);

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    // Log the database name
    console.log('Database name:', mongoose.connection.db.databaseName);
    
    try {
      // Directly list all collections
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('Collections:', collections.map(c => c.name));
      
      // Check if collections exist
      const hasTasksCollection = collections.some(c => c.name === 'tasks');
      const hasTaskGroupsCollection = collections.some(c => c.name === 'taskgroups');
      console.log('Tasks collection exists:', hasTasksCollection);
      console.log('TaskGroups collection exists:', hasTaskGroupsCollection);
      
      // Force initialize the models
      const taskModelInfo = mongoose.model('Task').collection;
      console.log('Task model initialized with collection:', taskModelInfo.name);
      
      const taskGroupModelInfo = mongoose.model('TaskGroup').collection;
      console.log('TaskGroup model initialized with collection:', taskGroupModelInfo.name);
      
      // Create indexes
      await mongoose.model('Task').collection.createIndex({ userId: 1 });
      console.log('Task index created on userId field');
      
      await mongoose.model('TaskGroup').collection.createIndex({ userId: 1 });
      console.log('TaskGroup index created on userId field');
      
    } catch (err) {
      console.error('Error managing collections:', err);
    }
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    console.error('Connection string used:', process.env.MONGODB_URI);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/taskGroups', taskGroupRoutes);

// Test endpoint to list all users
app.get('/api/user', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password field
    console.log('All users:', users);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint to list all tasks
app.get('/api/task', async (req, res) => {
  try {
    const tasks = await Task.find({});
    console.log('All tasks:', tasks);
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint to list all task groups
app.get('/api/taskGroup', async (req, res) => {
  try {
    const taskGroups = await TaskGroup.find({});
    console.log(`Found ${taskGroups.length} task groups`);
    // Return more detailed info but truncate large fields like imageBase64
    const processedTaskGroups = taskGroups.map(tg => ({
      id: tg._id.toString(),
      userId: tg.userId.toString(),
      areaName: tg.areaName,
      hasImage: !!tg.imageBase64,
      imageSize: tg.imageBase64 ? tg.imageBase64.length : 0,
      tasks: tg.tasks,
      progress: tg.progress,
      dateCreated: tg.dateCreated
    }));
    console.log('All task groups:', processedTaskGroups);
    res.json(processedTaskGroups);
  } catch (error) {
    console.error('Error fetching task groups:', error);
    res.status(500).json({ error: error.message });
  }
});

// Basic route
app.get('/', (req, res) => {
  res.send('CleanSmart Backend is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 