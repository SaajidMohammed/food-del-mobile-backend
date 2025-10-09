const { pool } = require('../config/db');

// 🛒 Create a new order with address
const placeOrder = async (userId, cartItems, address) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderRes = await client.query(
      'INSERT INTO orders (user_id, total_amount, address) VALUES ($1, $2, $3) RETURNING *',
      [userId, total, address]
    );

    const orderId = orderRes.rows[0].id;

    for (const item of cartItems) {
      await client.query(
        'INSERT INTO order_items (order_id, dish_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.dish_id, item.quantity, item.price]
      );
    }

    await client.query('COMMIT');
    return orderRes.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

// 📦 Fetch all orders for a user
const getOrdersByUser = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM orders WHERE user_id = $1 ORDER BY placed_at DESC',
    [userId]
  );
  return result.rows;
};

// 📄 Fetch detailed info for a single order
const getOrderDetails = async (orderId, userId) => {
  console.log(`[getOrderDetails] Received orderId: ${orderId}, userId: ${userId}`);
  const query = `
    SELECT 
      o.id AS order_id,
      o.total_amount,
      o.status,
      o.placed_at,
      o.address,
      oi.dish_id,
      d.name AS dish_name,
      d.image,
      oi.quantity,
      oi.price,
      (oi.quantity * oi.price) AS subtotal
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN dishes d ON oi.dish_id = d.id
    WHERE o.id = $1 AND o.user_id = $2
  `;
  console.log(`[getOrderDetails] Executing query: ${query} with values [${orderId}, ${userId}]`);
  const result = await pool.query(query, [orderId, userId]);
  console.log(`[getOrderDetails] Query returned ${result.rows.length} rows.`);
  console.log(`[getOrderDetails] Raw query results:`, result.rows);
  return result.rows;
};

// 🔄 Update order status
const updateOrderStatus = async (orderId, status, userId = null) => {
  const condition = userId
    ? 'WHERE id = $2 AND user_id = $3'
    : 'WHERE id = $2';

  const values = userId
    ? [status, orderId, userId]
    : [status, orderId];

  const result = await pool.query(
    `UPDATE orders SET status = $1 ${condition} RETURNING *`,
    values
  );

  return result.rows[0];
};

module.exports = {
  placeOrder,
  getOrdersByUser,
  getOrderDetails,
  updateOrderStatus
};
