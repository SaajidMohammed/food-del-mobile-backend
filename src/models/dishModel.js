const { pool } = require('../config/db');

const getDishesByRestaurant = async (restaurantId) => {
  console.log(`[getDishesByRestaurant] Fetching dishes for restaurantId: ${restaurantId}`);
  const result = await pool.query(
    'SELECT * FROM dishes WHERE restaurant_id = $1 AND available = true ORDER BY price ASC',
    [restaurantId]
  );
  console.log(`[getDishesByRestaurant] Found ${result.rows.length} dishes.`, result.rows);
  return result.rows;
};

module.exports = { getDishesByRestaurant };
