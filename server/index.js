// Imports
const cors = require('cors');

require('dotenv').config();
const path = require('path');
const express = require('express');

// Middleware imports
const handleCookieSessions = require('./middleware/handleCookieSessions');
const checkAuthentication = require('./middleware/checkAuthentication');
const logRoutes = require('./middleware/logRoutes');
const logErrors = require('./middleware/logErrors');

// Controller imports
const authControllers = require('./controllers/authControllers');
const userControllers = require('./controllers/userControllers');

// Route imports
const symptomRoutes = require('./routes/symptomRoutes');

const app = express();

// Optional: Enable CORS in development
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
}

// Middleware
// app.use(handleCookieSessions); // Adds a session property to each request representing the cookie
app.use(logRoutes); // Print information about each incoming request
app.use(express.json()); // Parse incoming request bodies as JSON
app.use(express.static(path.join(__dirname, '../frontend/dist'))); // Serve static assets from the frontend

// Auth Routes
app.post('/api/auth/register', authControllers.registerUser);
app.post('/api/auth/login', authControllers.loginUser);
app.get('/api/auth/me', authControllers.showMe);
app.delete('/api/auth/logout', authControllers.logoutUser);

// Symptom Routes (Requires authentication)
app.use('/api/symptoms', checkAuthentication, symptomRoutes);

app.post('/api/symptoms', checkAuthentication, async (req, res) => {
  const { date, symptoms } = req.body;

  if (!date || !symptoms) {
    return res.status(400).json({ error: 'Date and symptoms are required' });
  }

  try {
    const newLog = await db('symptom_logs')
      .insert({ date, symptoms })
      .returning('*');
    res.status(201).json(newLog[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save symptom log' });
  }
});

app.delete('/api/symptoms/:id', checkAuthentication, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCount = await db('symptom_logs').where({ id }).del();
    if (deletedCount) {
      res.status(200).json({ message: 'Log deleted successfully' });
    } else {
      res.status(404).json({ error: 'Log not found' });
    }
  } catch (err) {
    console.error('Error deleting log:', err); // Log the error for debugging
    res.status(500).json({ error: 'Failed to delete log' });
  }
});

app.get('/api/symptoms', checkAuthentication, async (req, res) => {
  try {
    const userId = req.session.user.id; // Assuming user ID is stored in the session
    const logs = await SymptomLog.listForUser(userId);
    res.json(logs);
  } catch (err) {
    console.error('Error fetching symptom logs:', err);
    res.status(500).json({ error: 'Failed to fetch symptom logs' });
  }
});

// User Routes (Requires authentication)
app.get('/api/users', checkAuthentication, userControllers.listUsers);
app.get('/api/users/:id', checkAuthentication, userControllers.showUser);
app.patch('/api/users/:id', checkAuthentication, userControllers.updateUser);

// Fallback Route for frontend routing (e.g., React Router)
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Error logging middleware
app.use(logErrors);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
