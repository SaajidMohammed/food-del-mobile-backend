const { pool } = require('../config/db');

const getUserById = async (userId) => {
  const result = await pool.query(
    'SELECT id, name, email, role FROM users WHERE id = $1',
    [userId]
  );
  return result.rows[0];
};

const removeUserById = async (userId) => {
  await pool.query('DELETE FROM users WHERE id = $1', [userId]);
};

module.exports = { getUserById, removeUserById };
