import express from 'express';
import {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { validateTaskInput } from '../middleware/validateTask.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Require authentication for all task operations
router.use(protect);

// Stats route (must be defined before /:id)
router.get('/stats', getTaskStats);

// Main collection routes
router
  .route('/')
  .get(getTasks)
  .post(validateTaskInput(false), createTask);

// Specific task routes
router
  .route('/:id')
  .get(getTaskById)
  .put(validateTaskInput(true), updateTask)
  .delete(deleteTask);

export default router;
