const express = require('express');
const { pool } = require('../config/db');
const {fetchRestaurants,fetchRestaurantById} = require('../controllers/restaurantController.js');

const router = express.Router();

router.get('/',fetchRestaurants);
router.get('/:id', fetchRestaurantById); 
router.get('/:id/dishes', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM dishes WHERE restaurant_id = $1', [id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching dishes:', err);
    res.status(500).json({ message: 'Failed to fetch dishes' });
  }
});


module.exports = router
