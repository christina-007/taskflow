import Task from '../models/Task.js';

// @desc    Get all tasks with optional search, filters, and sorting
// @route   GET /api/tasks
// @access  Public
export const getTasks = async (req, res, next) => {
  try {
    const { search, status, priority, sort } = req.query;

    const query = {};

    // Status filter
    if (status && status !== 'All') {
      query.status = status;
    }

    // Priority filter
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    // Search query on title and description
    if (search && search.trim() !== '') {
      const cleanSearch = search.trim();
      query.$or = [
        { title: { $regex: cleanSearch, $options: 'i' } },
        { description: { $regex: cleanSearch, $options: 'i' } },
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest first
    if (sort === 'createdAt_asc') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'dueDate_asc') {
      sortOption = { dueDate: 1, createdAt: -1 };
    } else if (sort === 'dueDate_desc') {
      sortOption = { dueDate: -1, createdAt: -1 };
    } else if (sort === 'priority') {
      // Custom priority sort can be handled via virtual or aggregation if needed, or by title
      sortOption = { priority: 1, createdAt: -1 };
    }

    const tasks = await Task.find(query).sort(sortOption);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics & stats
// @route   GET /api/tasks/stats
// @access  Public
export const getTaskStats = async (req, res, next) => {
  try {
    const [total, completed, pending, inProgress, highPriority, overdue] = await Promise.all([
      Task.countDocuments({}),
      Task.countDocuments({ status: 'Completed' }),
      Task.countDocuments({ status: 'Pending' }),
      Task.countDocuments({ status: 'In Progress' }),
      Task.countDocuments({ priority: 'High', status: { $ne: 'Completed' } }),
      Task.countDocuments({
        dueDate: { $ne: null, $lt: new Date() },
        status: { $ne: 'Completed' },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        completed,
        pending,
        inProgress,
        highPriority,
        overdue,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Public
export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Public
export const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    const task = await Task.create({
      title,
      description: description || '',
      priority: priority || 'Medium',
      status: status || 'Pending',
      dueDate: dueDate || null,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Public
export const updateTask = async (req, res, next) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully.',
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Public
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully.',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};
