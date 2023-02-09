import express from 'express';
import customersRouter from './clients/customers.routes.js';
import gameRouter from './games/games.routes.js';

const routers = express.Router();

routers.use(gameRouter);
routers.use(customersRouter);

export default routers;
