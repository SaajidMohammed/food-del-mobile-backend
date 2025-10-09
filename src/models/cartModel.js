const { pool } = require('../config/db');

const getCartByUser = async (userId) => {
  const result = await pool.query(`
    SELECT 
      ci.id, 
      d.name, 
      d.price, 
      ci.quantity, 
      (d.price * ci.quantity) AS total,
      d.image
    FROM cart_items ci
    JOIN dishes d ON ci.dish_id = d.id
    WHERE ci.user_id = $1
    ORDER BY ci.added_at DESC
  `, [userId]);

  return result.rows;
};

const addToCart = async (userId, dishId, quantity) => {
  const result = await pool.query(`
    INSERT INTO cart_items (user_id, dish_id, quantity)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, dish_id)
    DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
    RETURNING *
  `, [userId, dishId, quantity]);

  return result.rows[0];
};

const removeFromCart = async (userId, dishId) => {
  await pool.query(
    'DELETE FROM cart_items WHERE user_id = $1 AND dish_id = $2',
    [userId, dishId]
  );
};

const clearCartByUser = async (userId) => {
  return pool.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
};


module.exports = {
  getCartByUser,
  addToCart,
  removeFromCart,
  clearCartByUser
};
