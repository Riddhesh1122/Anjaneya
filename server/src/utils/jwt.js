const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const getSecret = () => process.env.JWT_SECRET || 'anjaneya-secret-key-development-12345';

const signToken = (payload, options = {}) => jwt.sign(payload, getSecret(), options);

const verifyToken = (token, options = {}) => jwt.verify(token, getSecret(), options);

module.exports = {
  signToken,
  verifyToken,
};