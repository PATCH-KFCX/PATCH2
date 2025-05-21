function checkAuthentication(req, res, next) {
  if (req.session && req.session.userId) {
    next(); // User is authenticated
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

module.exports = checkAuthentication;
