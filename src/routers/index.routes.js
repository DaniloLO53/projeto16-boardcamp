import express from 'express';
import gameRouter from './games/games.routes.js';

const routers = express.Router();

routers.use(gameRouter);

export default routers;
