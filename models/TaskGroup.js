const mongoose = require('mongoose');

const taskGroupSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  areaName: {
    type: String,
    required: true,
    trim: true
  },
  imageBase64: {
    type: String,
    default: null
  },
  tasks: [{
    type: String,
    trim: true
  }],
  progress: {
    type: Number,
    default: 0
  },
  dateCreated: {
    type: Number,
    default: () => Date.now()
  }
}, {
  // Add this to ensure the document can handle large strings like base64 images
  bufferCommands: false,
  autoCreate: false
});

// Pre-save hook to validate data
taskGroupSchema.pre('save', function(next) {
  console.log(`Pre-save hook for TaskGroup - Area: ${this.areaName}`);
  
  // Log image data presence
  if (this.imageBase64) {
    console.log(`Image data present, size: ${this.imageBase64.length} bytes`);
  } else {
    console.log('No image data present');
  }
  
  // Log tasks
  console.log(`Tasks count: ${this.tasks ? this.tasks.length : 0}`);
  
  next();
});

const TaskGroup = mongoose.model('TaskGroup', taskGroupSchema);

module.exports = TaskGroup; 