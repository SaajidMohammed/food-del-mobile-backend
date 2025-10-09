const jwt = require('jsonwebtoken');
const { pool } = require('../config/db'); // Make sure this path matches your setup

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔍 Fetch user role from DB
    const userRes = await pool.query(
      'SELECT id, role FROM users WHERE id = $1',
      [decoded.id]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = {
      id: userRes.rows[0].id,
      role: userRes.rows[0].role || 'user' // Default to 'user' if role is null
    };

    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = { verifyToken };
