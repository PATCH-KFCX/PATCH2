const User = require('../models/User');

exports.registerUser = async (req, res) => {
  const { name, age, email, password } = req.body;
  if (!name || !age || !email || !password) {
    return res.status(400).send({ message: 'Missing required fields' });
  }

  try {
    console.log('Creating user with:', { name, age, email });

    const user = await User.create(name, age, email, password); // <- likely where it fails
    req.session.userId = user.id;
    res.send(user);
  } catch (err) {
    console.error('Error during registration:', err); //debugging

    return res
      .status(500)
      .send({ message: 'Server error during registration' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'Email and password required' });
  }

  const user = await User.findByEmail(email);
  if (!user) {
    return res.status(404).send({ message: 'Email not found.' });
  }

  const isPasswordValid = await user.isValidPassword(password);
  if (!isPasswordValid) {
    return res.status(401).send({ message: 'Invalid credentials.' });
  }

  req.session.userId = user.id;
  console.log('✅ Session after login:', req.session);
  res.send(user);
};

exports.showMe = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send({ message: 'User must be authenticated.' });
  }

  const user = await User.find(req.session.userId);
  res.send(user);
};

exports.logoutUser = (req, res) => {
  req.session = null;
  res.status(204).send({ message: 'User logged out.' });
};
