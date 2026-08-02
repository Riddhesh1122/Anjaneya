const jwt = require('jsonwebtoken');

if (!process.env.JWT_SECRET) {
  throw new Error('Missing JWT_SECRET environment variable. Set JWT_SECRET before requiring the jwt utility.');
}

const signToken = (payload, options = {}) => jwt.sign(payload, process.env.JWT_SECRET, options);

const verifyToken = (token, options = {}) => jwt.verify(token, process.env.JWT_SECRET, options);

module.exports = {
  signToken,
  verifyToken,
};