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

  // Step 1: Check if the order exists
  const orderResult = await pool.query(
    'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
    [orderId, userId]
  );
  console.log(`[getOrderDetails] Order query returned ${orderResult.rows.length} rows.`, orderResult.rows);

  if (orderResult.rows.length === 0) {
    return []; // No order found
  }

  const order = orderResult.rows[0];

  // Step 2: Fetch order items for this order
  const orderItemsResult = await pool.query(
    'SELECT * FROM order_items WHERE order_id = $1',
    [orderId]
  );
  console.log(`[getOrderDetails] Order items query returned ${orderItemsResult.rows.length} rows.`, orderItemsResult.rows);

  if (orderItemsResult.rows.length === 0) {
    return []; // Order found, but no items
  }

  const orderItems = orderItemsResult.rows;
  const dishIds = orderItems.map(item => item.dish_id);

  // Step 3: Fetch details for each dish
  const dishesResult = await pool.query(
    'SELECT id, name, image, price FROM dishes WHERE id = ANY($1::int[])',
    [dishIds]
  );
  console.log(`[getOrderDetails] Dishes query returned ${dishesResult.rows.length} rows.`, dishesResult.rows);

  const dishesMap = new Map(dishesResult.rows.map(dish => [dish.id, dish]));

  // Reconstruct the details array as expected by the controller
  const details = orderItems.map(item => {
    const dish = dishesMap.get(item.dish_id);
    if (!dish) {
      console.warn(`[getOrderDetails] Dish with ID ${item.dish_id} not found for order item ${item.id}`);
      return null; // Or handle this case as appropriate
    }
    return {
      order_id: order.id,
      total_amount: order.total_amount,
      status: order.status,
      placed_at: order.placed_at,
      address: order.address,
      dish_id: item.dish_id,
      dish_name: dish.name,
      image: dish.image,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.quantity * item.price
    };
  }).filter(item => item !== null); // Filter out items where dish was not found

  console.log(`[getOrderDetails] Reconstructed details:`, details);
  return details;
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
