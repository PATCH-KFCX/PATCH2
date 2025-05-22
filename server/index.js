require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
const db = require('./db/knex');

db.migrate
  .latest()
  .then(() => console.log('✅ Migrations complete'))
  .catch((err) => {
    console.error('❌ Migration failed', err);
    process.exit(1); // prevent server from running if DB is bad
  });
app.set('trust proxy', 1);

// --- Middleware Imports ---
const handleCookieSessions = require('./middleware/handleCookieSessions');
const checkAuthentication = require('./middleware/authMiddleware');
const logRoutes = require('./middleware/logRoutes');
const logErrors = require('./middleware/logErrors');

// --- Controller Imports ---
const authControllers = require('./controllers/authControllers');
const userControllers = require('./controllers/userControllers');

// --- Route Imports ---
const symptomRoutes = require('./routes/symptomRoutes');
const diabetesRoutes = require('./routes/DiabetesRoutes');
const medicationRoutes = require('./routes/MedicationRoutes');

// --- Enable CORS BEFORE sessions ---
app.use(
  cors({
    origin: 'https://patch2.onrender.com', // your frontend URL
    credentials: true,
  })
);

// --- Use sessions BEFORE routes ---
app.use(handleCookieSessions);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logRoutes);

// --- Static Files ---
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// --- Auth Routes (public) ---
app.post('/api/auth/register', authControllers.registerUser);
app.post('/api/auth/login', authControllers.loginUser);
app.get('/api/auth/me', authControllers.showMe);
app.delete('/api/auth/logout', authControllers.logoutUser);

// --- Auth-Protected Routes ---
app.use('/api/symptoms', checkAuthentication, symptomRoutes);
app.use('/api/diabetes-logs', checkAuthentication, diabetesRoutes);
app.use('/api/medications', checkAuthentication, medicationRoutes);
app.get('/api/users', checkAuthentication, userControllers.listUsers);
app.get('/api/users/:id', checkAuthentication, userControllers.showUser);
app.patch('/api/users/:id', checkAuthentication, userControllers.updateUser);

// --- Optional Debug Route ---
app.get('/api/debug-session', (req, res) => {
  console.log('🧪 Session:', req.session);
  res.json(req.session || {});
});

app.use(logErrors);

// --- Start Server ---
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}/`);
});
