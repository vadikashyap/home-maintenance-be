const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');  // Importing JWT package
const User = require('../models/User');
const Task = require('../models/Task');
const router = express.Router();
require('dotenv').config(); // Load environment variables

// Predefined tasks
const predefinedTasks = [
  { name: 'Change water filter', isPredefined: true, reminderTime: null },
  { name: 'Test smoke/fire alarm', isPredefined: true, reminderTime: null },
  { name: 'Replace air purifier filter', isPredefined: true, reminderTime: null },
];

// Utility function to set reminder time based on interval
const setReminderTime = (interval) => {
  const now = new Date();

  if (interval === 'yearly') {
    now.setFullYear(now.getFullYear() + 1);
    now.setMonth(0);
    now.setDate(1);
  } else if (interval === 'monthly') {
    now.setMonth(now.getMonth() + 1);
    now.setDate(1);
  } else if (interval === 'weekly') {
    const dayOfWeek = now.getDay();
    const diffToMonday = (7 - dayOfWeek + 1) % 7;
    now.setDate(now.getDate() + diffToMonday);
  }

  return now;
};

// Route: Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password using crypto
    const salt = crypto.randomBytes(16).toString('hex'); // Generate a random salt
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

    // Generate token before saving the user
    const generateToken = () => jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Create a new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      salt, // Save the salt for verifying passwords later
    });

    // Generate the token before saving the user
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Save the user to the database
    user.token = token;  // Set the token before saving the user

    const savedUser = await user.save();

    // Add predefined tasks for the user
    const tasksWithUserId = predefinedTasks.map((task) => ({
      ...task,
      user: savedUser._id,
      reminderTime: setReminderTime(task.interval),
    }));

    const createdTasks = await Task.insertMany(tasksWithUserId);

    // Link tasks to the user
    savedUser.tasks = createdTasks.map((task) => task._id);
    await savedUser.save();

    // Return the saved user excluding sensitive data like password
    const userResponse = savedUser.toObject();
    delete userResponse.password;
    delete userResponse.salt;

    // Send the response with the token
    res.status(201).json({ user: userResponse, token });

  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
});


// Route: Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the provided password using the stored salt
    const hashedPassword = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');
    console.log('hashedPassword:', hashedPassword);  // Debugging log

    // Compare the hashed password with the stored password
    if (hashedPassword !== user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET, // Secret key from environment
      { expiresIn: '1h' } // Token expiration time
    );

    res.status(200).json({ message: 'Login successful', token,userId:user._id , name:user.name,email:user.email});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware to verify token for protected routes
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>

  // Log the authorization header to check its format
  console.log('Authorization header:', req.headers['authorization']);

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  // Log the secret for debugging
  console.log('JWT_SECRET:', process.env.JWT_SECRET);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('JWT verification error:', err.message);  // Log the error
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.user = decoded; // Attach the decoded user to the request object
    next(); // Proceed to the next middleware/route
  });
};
// Route: Get user and their tasks (protected)
router.get('/:id', authenticateToken, async (req, res) => {
  console.log('req.user.userId req.user.userId ',req.user.userId )
  try {
    if (req.user.userId !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const user = await User.findById(req.params.id).populate('tasks');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
