// Load environment variables from .env
require('dotenv').config();

const path = require('path');
const express = require('express');

const app = express();

// Middleware
const handleCookieSessions = require('./middleware/handleCookieSessions');
const checkAuthentication = require('./middleware/checkAuthentication');
const logRoutes = require('./middleware/logRoutes');
const logErrors = require('./middleware/logErrors');

// Controllers
const authControllers = require('./controllers/authControllers');
const userControllers = require('./controllers/userControllers');

// Routes
const symptomRoutes = require('./routes/symptomRoutes'); // Importing symptom routes

// Apply Middleware
app.use(handleCookieSessions); // Sets up req.session via cookie-session
app.use(logRoutes); // Logs all incoming requests
app.use(express.json()); // Parses incoming JSON
app.use(express.static(path.join(__dirname, '../frontend/dist'))); // Serves frontend build

// Auth Routes
app.post('/api/auth/register', authControllers.registerUser);
app.post('/api/auth/login', authControllers.loginUser);
app.get('/api/auth/me', authControllers.showMe);
app.delete('/api/auth/logout', authControllers.logoutUser);

// User Routes (Protected)
app.get('/api/users', checkAuthentication, userControllers.listUsers);
app.get('/api/users/:id', checkAuthentication, userControllers.showUser);
app.patch('/api/users/:id', checkAuthentication, userControllers.updateUser);

// Symptom Routes (Protected)
app.use('/api/symptoms', checkAuthentication, symptomRoutes);

// Fallback for SPA Frontend
// Serves index.html for any non-API routes
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Error Logging Middleware
app.use(logErrors);

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(` Server running at http://localhost:${port}/`);
});
