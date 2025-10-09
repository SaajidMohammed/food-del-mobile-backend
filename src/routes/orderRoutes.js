const express = require('express');
const {
  createOrder,
  fetchOrders,
  fetchOrderDetails,
  changeOrderStatus,
  fetchAllOrders // ✅ Add this to your controller
} = require('../controllers/orderController');

const { verifyToken } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/isAdmin'); // ✅ New middleware

const router = express.Router();

// 🔐 User routes
router.post('/', verifyToken, createOrder);
router.get('/', verifyToken, fetchOrders);
router.get('/:id', verifyToken, fetchOrderDetails);
router.patch('/:id/status', verifyToken, changeOrderStatus);

// 🛡️ Admin routes
router.get('/admin/all', verifyToken, isAdmin, fetchAllOrders);
router.patch('/admin/:id/status', verifyToken, isAdmin, changeOrderStatus);

module.exports = router;
