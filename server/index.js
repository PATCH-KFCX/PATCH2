// Imports
require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();

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
const diabetesRoutes = require('./routes/DiabetesRoutes');

// Optional: Enable CORS in development
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
}

// Middleware setup
app.use(handleCookieSessions);
app.use(logRoutes);
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Auth Routes
app.post('/api/auth/register', authControllers.registerUser);
app.post('/api/auth/login', authControllers.loginUser);
app.get('/api/auth/me', authControllers.showMe);
app.delete('/api/auth/logout', authControllers.logoutUser);

// Routes that require authentication
app.use('/api/symptoms', checkAuthentication, symptomRoutes); // ✅ symptom routes
app.use('/api/diabetes-logs', checkAuthentication, diabetesRoutes); // ✅ diabetes tracker

// User Routes
app.get('/api/users', checkAuthentication, userControllers.listUsers);
app.get('/api/users/:id', checkAuthentication, userControllers.showUser);
app.patch('/api/users/:id', checkAuthentication, userControllers.updateUser);

// Fallback Route for React frontend
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Error Logging
app.use(logErrors);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}/`);
});
