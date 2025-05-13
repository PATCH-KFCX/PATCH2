const User = require('../models/User'); // Import the User model to interact with the database

/*
GET /api/users
Returns a list of all users in the database.
This is typically used for admin tools or internal views.
*/
exports.listUsers = async (req, res) => {
  const users = await User.list(); // Fetch all users
  res.send(users); // Send the list as a response
};

/*
GET /api/users/:id
Returns information about a specific user by their ID.
If the user isn't found, sends a 404 error.
*/
exports.showUser = async (req, res) => {
  const { id } = req.params; // Get the user ID from the URL

  const user = await User.find(id); // Try to find the user in the database
  if (!user) {
    return res.status(404).send({ message: 'User not found.' }); // If not found, return error
  }

  res.send(user); // Otherwise, return the user info
};

/*
/api/users/:id
Allows a user to update their own username.
It checks that the logged-in user is only modifying their own account.
*/
exports.updateUser = async (req, res) => {
  const { email } = req.body; // New username provided by the user
  if (!email) {
    return res.status(400).send({ message: 'New Email required.' }); // Require a username
  }

  // Convert IDs to numbers to avoid string mismatch
  const userToModify = Number(req.params.id); // The user being updated
  const userRequestingChange = Number(req.session.userId); // The currently logged-in user

  // Prevent users from updating someone else's account
  if (userRequestingChange !== userToModify) {
    return res.status(403).send({ message: "Unauthorized." });
  }

  // Attempt to update the user in the database
  const updatedUser = await User.update(userToModify, email);
  if (!updatedUser) {
    return res.status(404).send({ message: 'User not found.' }); // If user not found
  }

  res.send(updatedUser); // Send back the updated user info
};

/*
POST /api/users
Creates a new user account.
This is helpful for testing or if you want an alternate way to add users.
Not part of login system but functions similarly to registration.
*/

exports.createUser = async (req, res) => {
  const { name, password } = req.body; // New user info
  if (!name || !password) {
    return res.status(400).send({ message: 'Name and password required.' });
  }

  try {
    // Try to create the user and return their info
    const newUser = await User.create(name, password);
    res.status(201).send(newUser);
  } catch (err) {
    // Handle unexpected errors gracefully
    console.error(err);
    res.status(500).send({ message: 'Error creating user.' });
  }
};
