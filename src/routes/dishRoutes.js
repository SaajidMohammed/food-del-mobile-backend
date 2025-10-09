const express = require('express');
const {fetchDishes} = require('../controllers/dishController.js');

const router = express.Router();

router.get('/:restaurantId',fetchDishes);

module.exports = router;