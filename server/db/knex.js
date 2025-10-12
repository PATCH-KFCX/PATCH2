// Load environment variables
require('dotenv').config();

// Determine environment
const env = process.env.NODE_ENV || 'development';

// Get the correct knex configuration
const config = require('../knexfile')[env];

// Debug log
console.log(`ENV: ${env}`);
console.log('DB config:', config.connection);

if (typeof config.connection === 'string') {
  // Parse the DATABASE_URL to show components (without password)
  try {
    const url = new URL(config.connection);
    console.log('Database connection details:');
    console.log(`  Protocol: ${url.protocol}`);
    console.log(`  Hostname: ${url.hostname}`);
    console.log(`  Port: ${url.port || 'default'}`);
    console.log(`  Database: ${url.pathname.substring(1)}`);
    console.log(`  Username: ${url.username}`);
    console.log(`  Has password: ${url.password ? 'Yes' : 'No'}`);
  } catch (e) {
    console.log('Could not parse DATABASE_URL:', e.message);
  }
}

// Export the knex instance
module.exports = require('knex')(config);
