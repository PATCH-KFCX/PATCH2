const cookieSession = require('cookie-session');

module.exports = cookieSession({
  name: 'session',
  secret: process.env.SESSION_SECRET || 'patch_secret',
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production', // true on Render
});
