// Imports
import cors from 'cors';

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
app.use(handleCookieSessions); // Adds a session property to each request representing the cookie
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
