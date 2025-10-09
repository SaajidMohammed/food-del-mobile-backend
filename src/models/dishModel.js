const { pool } = require('../config/db');

const getDishesByRestaurant = async (restaurantId) => {
  const result = await pool.query(
    'SELECT * FROM dishes WHERE restaurant_id = $1 AND available = true ORDER BY price ASC',
    [restaurantId]
  );
  return result.rows;
};

module.exports = { getDishesByRestaurant };
