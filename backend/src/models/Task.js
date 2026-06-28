import mongoose from 'mongoose';

const subtaskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Subtask text is required'],
    trim: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
});

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    subtasks: [subtaskSchema],
    dueDate: {
      type: Date,
      required: [true, 'Due date is required']
    }
  },
  {
    timestamps: true
  }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;
