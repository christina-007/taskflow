const VALID_PRIORITIES = ['Low', 'Medium', 'High'];
const VALID_STATUSES = ['Pending', 'In Progress', 'Completed'];

export const validateTaskInput = (isUpdate = false) => {
  return (req, res, next) => {
    const { title, description, priority, status, dueDate } = req.body;
    const errors = [];

    // Title validation
    if (!isUpdate || title !== undefined) {
      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        errors.push({ field: 'title', message: 'Task title is required and cannot be empty.' });
      } else if (title.trim().length > 140) {
        errors.push({ field: 'title', message: 'Task title must be 140 characters or less.' });
      } else {
        req.body.title = title.trim();
      }
    }

    // Description validation
    if (description !== undefined && description !== null) {
      if (typeof description !== 'string') {
        errors.push({ field: 'description', message: 'Description must be a string.' });
      } else if (description.length > 2000) {
        errors.push({ field: 'description', message: 'Description must be 2000 characters or less.' });
      } else {
        req.body.description = description.trim();
      }
    }

    // Priority validation
    if (priority !== undefined) {
      if (!VALID_PRIORITIES.includes(priority)) {
        errors.push({
          field: 'priority',
          message: `Priority must be one of: ${VALID_PRIORITIES.join(', ')}.`,
        });
      }
    }

    // Status validation
    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        errors.push({
          field: 'status',
          message: `Status must be one of: ${VALID_STATUSES.join(', ')}.`,
        });
      }
    }

    // Due date validation
    if (dueDate !== undefined && dueDate !== null && dueDate !== '') {
      const dateVal = new Date(dueDate);
      if (isNaN(dateVal.getTime())) {
        errors.push({ field: 'dueDate', message: 'Due date must be a valid date format.' });
      } else {
        req.body.dueDate = dateVal;
      }
    } else if (dueDate === '' || dueDate === null) {
      req.body.dueDate = null;
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors,
      });
    }

    next();
  };
};
