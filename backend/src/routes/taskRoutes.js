import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
} from '../controllers/taskController.js';

const router = express.Router();

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/stats')
  .get(getTaskStats);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

export default router;
