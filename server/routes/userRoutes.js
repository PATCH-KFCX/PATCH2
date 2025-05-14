// Import Express to create a router instance
const express = require('express');

const router = express.Router();

// Import the UsersController to connect routes to logic
const UsersController = require('../controllers/usersController');

// Route to create a new user (POST request to /api/users)
router.post('/', UsersController.create);

// Route to get a list of all users (GET request to /api/users)
router.get('/', UsersController.index);

// Route to get a single user by ID (GET request to /api/users/:id)
router.get('/:id', UsersController.show);

// Export the router so it can be used in the main server file
module.exports = router;
