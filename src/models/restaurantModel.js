const {pool} = require('../config/db.js');

const getAllRestaurants = async () => {
    const result = await pool.query('SELECT * FROM restaurants ORDER BY rating DESC');
    return result.rows;
};

module.exports = {getAllRestaurants}