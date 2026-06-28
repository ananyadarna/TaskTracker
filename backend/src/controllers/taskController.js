import Task from '../models/Task.js';
import Activity from '../models/Activity.js';

// Helper function to log activity
const logActivity = async (action, taskTitle) => {
  try {
    await Activity.create({ action, taskTitle });
  } catch (error) {
    console.error('Failed to log activity:', error.message);
  }
};

// @desc    Get all tasks with filtering, sorting, and searching
// @route   GET /api/tasks
// @access  Public
export const getTasks = async (req, res, next) => {
  try {
    const { status, priority, q, sort } = req.query;
    const query = {};

    // Filtering by Status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filtering by Priority
    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    // Search query (fuzzy search on title or description)
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // Default: newest first
    if (sort) {
      const [field, order] = sort.split(':');
      sortOptions[field] = order === 'desc' ? -1 : 1;
      // Remove default sorting if another field is specified
      if (field !== 'createdAt') {
        delete sortOptions.createdAt;
      }
    }

    const tasks = await Task.find(query).sort(sortOptions);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Public
export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Public
export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, tags, subtasks, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      tags,
      subtasks,
      dueDate
    });

    await logActivity('Created task', task.title);

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing task
// @route   PUT /api/tasks/:id
// @access  Public
export const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, tags, subtasks, dueDate } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const oldStatus = task.status;

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;
    task.priority = priority ?? task.priority;
    task.tags = tags ?? task.tags;
    task.subtasks = subtasks ?? task.subtasks;
    task.dueDate = dueDate ?? task.dueDate;

    const updatedTask = await task.save();

    // Log status change or update action
    if (oldStatus !== updatedTask.status) {
      await logActivity(`Marked as ${updatedTask.status}`, updatedTask.title);
    } else {
      await logActivity('Updated details for', updatedTask.title);
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Public
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    await logActivity('Deleted task', task.title);

    res.status(200).json({ message: 'Task deleted successfully', id: req.params.id });
  } catch (error) {
    next(error);
  }
};

// @desc    Get task statistics/analytics
// @route   GET /api/tasks/stats
// @access  Public
export const getTaskStats = async (req, res, next) => {
  try {
    const stats = await Task.aggregate([
      {
        $facet: {
          statusCounts: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 }
              }
            }
          ],
          priorityCounts: [
            {
              $group: {
                _id: '$priority',
                count: { $sum: 1 }
              }
            }
          ],
          subtaskStats: [
            { $unwind: { path: '$subtasks', preserveNullAndEmptyArrays: false } },
            {
              $group: {
                _id: null,
                totalSubtasks: { $sum: 1 },
                completedSubtasks: {
                  $sum: { $cond: [{ $eq: ['$subtasks.isCompleted', true] }, 1, 0] }
                }
              }
            }
          ],
          totalCount: [
            { $count: 'count' }
          ]
        }
      }
    ]);

    const facetResult = stats[0];
    const totalTasks = facetResult.totalCount[0]?.count || 0;

    // Format status breakdown
    const statusBreakdown = { pending: 0, 'in-progress': 0, completed: 0 };
    facetResult.statusCounts.forEach((item) => {
      statusBreakdown[item._id] = item.count;
    });

    // Format priority breakdown
    const priorityBreakdown = { low: 0, medium: 0, high: 0 };
    facetResult.priorityCounts.forEach((item) => {
      priorityBreakdown[item._id] = item.count;
    });

    // Subtask counts
    const totalSubtasks = facetResult.subtaskStats[0]?.totalSubtasks || 0;
    const completedSubtasks = facetResult.subtaskStats[0]?.completedSubtasks || 0;

    res.status(200).json({
      totalTasks,
      statusBreakdown,
      priorityBreakdown,
      subtasks: {
        total: totalSubtasks,
        completed: completedSubtasks
      },
      completionRate: totalTasks > 0 ? Math.round((statusBreakdown.completed / totalTasks) * 100) : 0
    });
  } catch (error) {
    next(error);
  }
};
