const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const jwt = require('jsonwebtoken');  // Importing JWT package
const router = express.Router();

// Middleware to verify token for protected routes
const authenticateToken = (req, res, next) => {

  const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded;
    next(); // Proceed to the next middleware/route
  });
};
// Add a new task
router.post('/', authenticateToken, async (req, res) => {
  const { name, isPredefined, reminderTime, userId } = req.body;

  if (!name || !userId) {
    return res.status(400).json({ message: 'Task name and user ID are required' });
  }

  try {
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create new task
    const task = new Task({
      name,
      isPredefined,
      reminderTime,
      user: userId,
    });

    const savedTask = await task.save();
    user.tasks.push(savedTask._id);
    await user.save();

    // Return created task
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Error during task creation:', error); // Improved logging
    res.status(500).json({ message: error.message });
  }
});


// Update reminder settings for a task
router.put('/:id', authenticateToken, async (req, res) => {
  const { isReminderSet, reminderTime } = req.body;

  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure the task belongs to the logged-in user
    if (task.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    task.isReminderSet = isReminderSet;
    task.reminderTime = reminderTime; // Update reminder time if provided

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update task reminder', error });
  }
});

module.exports = router;
