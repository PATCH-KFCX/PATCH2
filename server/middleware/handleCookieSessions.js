const cookieSession = require('cookie-session');

module.exports = cookieSession({
  name: 'session',
  secret: process.env.SESSION_SECRET || 'defaultsecret',
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: 'lax',
  secure: false,
});
