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

const router = express.Router();

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
