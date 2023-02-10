import express from 'express';
import categoriesRoute from './categories/categories.routes.js';
import customersRoute from './clients/customers.routes.js';
import gameRoute from './games/games.routes.js';
import rentalsRoute from './rentals/rentals.routes.js';

const routers = express.Router();

routers.use(gameRoute);
routers.use(customersRoute);
routers.use(rentalsRoute);
routers.use(categoriesRoute);

export default routers;
