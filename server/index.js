require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
const db = require('./db/knex');

// Test database connection with retry logic
async function testDatabaseConnection(maxRetries = 5, retryDelay = 15000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    let testDb = null;
    
    try {
      console.log(`🔍 Testing database connection (attempt ${attempt}/${maxRetries})...`);
      
      // Create a fresh connection for each test to avoid pool issues
      const config = require('./knexfile')[process.env.NODE_ENV || 'production'];
      testDb = require('knex')(config);
      
      // Simple connection test

      // Only start the server if running locally (not in Vercel serverless)
      if (require.main === module) {
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
          console.log(`Server running at http://localhost:${port}/`);
        });
      }

      // Export the app for Vercel serverless functions
      module.exports = app;
const authControllers = require('./controllers/authControllers');
const userControllers = require('./controllers/userControllers');

// --- Routes ---
const symptomRoutes = require('./routes/symptomRoutes');
const diabetesRoutes = require('./routes/DiabetesRoutes');
const medicationRoutes = require('./routes/MedicationRoutes');

// --- Enable CORS ---
const allowedOrigins = [
  'http://localhost:5173', // Vite dev server
  'http://localhost:3000', // Alternative local dev
  'https://patch2-backend.onrender.com', // Old backend URL
  'https://patch2.onrender.com', // New backend URL
];

// Add any other production URLs if needed
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, postman, etc.)
      if (!origin) return callback(null, true);
      
      // Allow same-origin requests (frontend and backend on same domain)
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      
      // Allow all Render domains since we're serving frontend + backend together
      if (origin && origin.includes('onrender.com')) {
        return callback(null, true);
      }
      
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// --- Core middleware ---
app.use(handleCookieSessions);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logRoutes);

// --- Health check endpoint ---
app.get('/api/health', async (req, res) => {
  try {
    await db.raw('SELECT 1');
    res.json({ 
      status: 'healthy', 
      database: 'connected',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  }
});

// --- Simple test endpoint ---
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server is running!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// --- Serve static files ---
const frontendDistPath = path.join(__dirname, '../frontend/dist');
console.log('🔍 Checking for frontend build at:', frontendDistPath);

// Check if frontend build exists
const fs = require('fs');
if (fs.existsSync(frontendDistPath)) {
  console.log('✅ Frontend build found, serving static files');
  app.use(express.static(frontendDistPath));
} else {
  console.log('❌ Frontend build not found at expected path');
  console.log('Make sure the build command runs: cd frontend && npm run build');
}

// --- Auth routes (public) ---
app.post('/api/auth/register', authControllers.registerUser);
app.post('/api/auth/login', authControllers.loginUser);
app.get('/api/auth/me', authControllers.showMe);
app.delete('/api/auth/logout', authControllers.logoutUser);

// --- Debug middleware to test route access ---
app.use(
  '/api/symptoms',
  (req, res, next) => {
    console.log('📥 /api/symptoms hit');
    next();
  },
  checkAuthentication,
  symptomRoutes
);

app.use(
  '/api/diabetes-logs',
  (req, res, next) => {
    console.log('📥 /api/diabetes-logs hit');
    next();
  },
  checkAuthentication,
  diabetesRoutes
);

app.use('/api/medications', checkAuthentication, medicationRoutes);
app.get('/api/users', checkAuthentication, userControllers.listUsers);
app.get('/api/users/:id', checkAuthentication, userControllers.showUser);
app.patch('/api/users/:id', checkAuthentication, userControllers.updateUser);

// --- Debug session route ---
app.get('/api/debug-session', (req, res) => {
  console.log('🧪 Session:', req.session);
  res.json(req.session || {});
});

// --- Catch-all handler: send back React's index.html file for client-side routing ---
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// --- Global error handler for unhandled errors ---
app.use((err, req, res, next) => {
  console.error('🔥 Unhandled error:', err);
  console.error('Request URL:', req.url);
  console.error('Request method:', req.method);
  
  if (res.headersSent) {
    return next(err);
  }
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// --- Error handling ---
app.use(logErrors);
