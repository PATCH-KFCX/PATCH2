// Load environment variables
require('dotenv').config();

// Determine environment
const env = process.env.NODE_ENV || 'development';

// Get the correct knex configuration
const config = require('../knexfile')[env];

// Debug log
console.log(`ENV: ${env}`);
console.log('DB config:', config.connection);

// Export the knex instance
module.exports = require('knex')(config);
