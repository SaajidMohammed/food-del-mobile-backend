const {
  placeOrder,
  getOrdersByUser,
  getOrderDetails,
  updateOrderStatus
} = require('../models/orderModel');

const { getCartByUser, clearCartByUser } = require('../models/cartModel');
const { pool } = require('../config/db');

// 🛒 Create a new order from cart
const createOrder = async (req, res) => {
  const userId = req.user.id;
  const { address } = req.body;

  if (!address || address.trim() === '') {
    return res.status(400).json({ error: 'Delivery address is required' });
  }

  try {
    const cartItems = await getCartByUser(userId);
    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const order = await placeOrder(userId, cartItems, address);
    await clearCartByUser(userId); // ✅ Clear cart after order
    res.status(201).json(order);
  } catch (err) {
    console.error('❌ Order creation failed:', err.message);
    res.status(500).json({ error: 'Failed to place order' });
  }
};

// 📦 Fetch all orders for a user
const fetchOrders = async (req, res) => {
  const userId = req.user.id;
  try {
    const orders = await getOrdersByUser(userId);
    res.status(200).json(orders);
  } catch (err) {
    console.error('❌ Failed to fetch user orders:', err.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// 📄 Fetch detailed info for a single order
const fetchOrderDetails = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const details = await getOrderDetails(id, userId);
    if (details.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const { order_id, total_amount, status, placed_at, address } = details[0];
    const items = details.map(item => ({
      dishId: item.dish_id,
      name: item.dish_name,
      image: item.image,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal
    }));

    res.status(200).json({
      orderId: order_id,
      totalAmount: total_amount,
      status,
      placedAt: placed_at,
      address,
      items
    });
  } catch (err) {
    console.error('❌ Failed to fetch order details:', err.message);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
};

// 🔄 Change order status (user or admin)
const changeOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user.id;
  const isAdmin = req.user.role === 'admin';

  const validStatuses = ['pending', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    const updated = await updateOrderStatus(id, status, isAdmin ? null : userId);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found or unauthorized' });
    }
    res.status(200).json(updated);
  } catch (err) {
    console.error('❌ Failed to update order status:', err.message);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

// 🛡️ Admin: Fetch all orders
const fetchAllOrders = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY placed_at DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Failed to fetch all orders:', err.message);
    res.status(500).json({ error: 'Failed to fetch all orders' });
  }
};

module.exports = {
  createOrder,
  fetchOrders,
  fetchOrderDetails,
  changeOrderStatus,
  fetchAllOrders
};
