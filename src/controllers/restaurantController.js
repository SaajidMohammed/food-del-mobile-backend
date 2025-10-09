const { pool } = require('../config/db');
const {getAllRestaurants} = require('../models/restaurantModel.js');

const fetchRestaurants = async (req,res) => {
    try {
        const restaurants = await getAllRestaurants();
        res.status(200).json(restaurants);
    } catch (err) {
        console.log("Error fetching restaurants:",err.message);
        res.status(500).json({error:"Failed to fetch restaurants"});
    }
};

const fetchRestaurantById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM restaurants WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching restaurant:', err);
      console.log('Fetching restaurant with ID:', id);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {fetchRestaurants, fetchRestaurantById};
