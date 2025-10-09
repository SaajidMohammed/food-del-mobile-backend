const express = require('express');
const { fetchCart, addItem, removeItem, clearCart } = require('../controllers/cartController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', verifyToken, fetchCart);
router.post('/', verifyToken, addItem);
router.delete('/:dishId', verifyToken, removeItem);
router.delete('/', verifyToken, clearCart);


module.exports = router;
