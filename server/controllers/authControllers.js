const User = require("../models/User");

exports.registerUser = async (req, res) => {
<<<<<<< Updated upstream
=======
  console.log("Received registration request:", req.body); // Debug: log registration payload

  // Request needs a body
  if (!req.body) {
    return res.status(400).send({ message: "Username and password required" });
  }

  // Body needs a username and password
>>>>>>> Stashed changes
  const { name, age, email, password } = req.body;
  if (!name || !age || !email || !password) {
    return res.status(400).send({ message: "Username and password required" });
  }

<<<<<<< Updated upstream
  try {
    const user = await User.create(name, age, email, password);
    req.session.userId = user.id;
    res.send(user);
  } catch (err) {
    if (err.message === 'Email is already in use') {
      return res.status(409).send({ message: err.message }); // 409 Conflict
    }
    console.error(err);
    res.status(500).send({ message: 'Server error during registration' });
  }
=======
  // User.create will handle hashing the password and storing in the database
  const user = await User.create(name, age, email, password);

  // Add the user id to the cookie and send the user data back
  req.session.userId = user.id;
  res.send(user);
>>>>>>> Stashed changes
};


exports.loginUser = async (req, res) => {
  // console.log('Login attempt:', req.body); // Optional: Debug login attempts

  // Request needs a body
  if (!req.body) {
    return res.status(400).send({ message: "Username and password required" });
  }

  // Body needs a username and password
  const { email, password } = req.body;
  console.log(`TESTING EMAIL: ${email}, PASSWORD: ${password}`);
  if (!email || !password) {
    return res.status(400).send({ message: "Email and password required" });
  }

  // Username must be valid
  const user = await User.findByEmail(email);
  if (!user) {
    return res.status(404).send({ message: "User not found." });
  }

  // Password must match
  const isPasswordValid = await user.isValidPassword(password);
  if (!isPasswordValid) {
    return res.status(401).send({ message: "Invalid credentials." });
  }

  // Add the user id to the cookie and send the user data back
  req.session.userId = user.id;
  res.send(user);
};

exports.showMe = async (req, res) => {
  // console.log('Checking current session'); // Optional: Debug auth check

  // no cookie with an id => Not authenticated.
  if (!req.session.userId) {
    return res.status(401).send({ message: "User must be authenticated." });
  }

  // cookie with an id => here's your user info!
  const user = await User.find(req.session.userId);
  res.send(user);
};

exports.logoutUser = (req, res) => {
  // console.log('Logging out user:', req.session.userId); // Optional: Debug logout
  req.session = null; // "erase" the cookie
  res.status(204).send({ message: "User logged out." });
};
