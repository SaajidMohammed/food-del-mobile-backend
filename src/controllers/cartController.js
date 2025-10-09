const { getCartByUser, addToCart, removeFromCart } = require('../models/cartModel');
const { clearCartByUser } = require('../models/cartModel');

const fetchCart = async (req, res) => {
  const userId = req.user.id;
  try {
    const cart = await getCartByUser(userId);
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

const addItem = async (req, res) => {
  const userId = req.user.id;
  const { dishId, quantity } = req.body;
  console.log(`Attempting to add to cart: userId=${userId}, dishId=${dishId}, quantity=${quantity}`); // Added log
  try {
    const item = await addToCart(userId, dishId, quantity);
    res.status(201).json(item);
  } catch (err) {
    console.error('❌ Add to cart failed:', err.message);
    console.error('🔍 Full error:', err);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

const removeItem = async (req, res) => {
  const userId = req.user.id;
  const { dishId } = req.params;
  try {
    await removeFromCart(userId, dishId);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};

const clearCart = async (req, res) => {
  const userId = req.user.id;
   console.log('🧹 Clearing cart for user:', userId);
  try {
    await clearCartByUser(userId);
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (err) {
    console.error('❌ Clear cart failed:', err.message);
    
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};


module.exports = { fetchCart, addItem, removeItem, clearCart };
