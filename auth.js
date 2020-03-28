const jwt = require('jsonwebtoken');

module.exports = function(request, response, next) {
  const token = request.headers.authorization;
  if (!token) {
    return response.status(401).json({ msg: 'Please Login' });
  }
  try {
    const decoded = jwt.verify(token, 'SecretKey9999');
    request.user = decoded.user;
    next();
  } 
  catch (err) {
    response.status(401).json({ msg: 'Invalid Token' });
  }
};
