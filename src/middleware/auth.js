const jwt = require('jsonwebtoken');
const db = require('../db');
const dotenv = require('dotenv');

dotenv.config();

exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Invalid Authorization header format' });
    const token = parts[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const { rows } = await db.query(
      'SELECT u.id, u.name, u.email, r.name as role_name FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.id = $1',
      [payload.userId]
    );
    if (!rows[0]) return res.status(401).json({ error: 'User not found' });
    req.user = rows[0];
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

exports.requireAdmin = (req, res, next) => {
  if (req.user && req.user.role_name === 'admin') return next();
  return res.status(403).json({ error: 'Requires admin role' });
};