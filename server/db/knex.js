// Load environment variables from the .env file
const env = process.env.NODE_ENV || 'development';

// Import the correct configuration based on the environment (development, production, etc.)
const config = require('../knexfile')[env];

// Export a new Knex instance using the selected environment config
// This allows the rest of the app to use the database connection easily
module.exports = require('knex')(config);
