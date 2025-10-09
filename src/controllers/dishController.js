const {getDishesByRestaurant} = require('../models/dishModel.js');

const fetchDishes = async (req,res) => {
    const {restaurantId} = req.params;
    try {
        const dishes = await getDishesByRestaurant(restaurantId);
        res.status(200).json(dishes);
    } catch (err) {
        console.error('Error fetching dishes:',err.message);
        res.status(500).json({message:"Failed to fetch dishes"});
    }
};

module.exports = {fetchDishes};