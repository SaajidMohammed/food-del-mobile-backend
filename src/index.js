const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const {connectDB} = require('./config/db.js');
const authRoutes = require('./routes/authRoutes.js');
const restaurantRoutes = require('./routes/restaurantRoutes.js');
const dishRoutes = require('./routes/dishRoutes.js');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');



const app = express();
app.use(cors({origin:'*'}));
app.use(express.json());

//DB Connection
connectDB();

//authentication routes
app.use('/api/auth', authRoutes);
//restaurant route
app.use('/api/restaurants',restaurantRoutes)
//dishes route
app.use('/api/dishes',dishRoutes);
//cart route
app.use('/api/cart',cartRoutes);
//order route
app.use('/api/orders', orderRoutes);
//user route
app.use('/api/user', require('./routes/userRoutes'));

app.get('/', (req,res) => res.send('API is Running'));

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
