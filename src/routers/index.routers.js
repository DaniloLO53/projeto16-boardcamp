import express from 'express';
import gameRouter from './games/games.routers.js';

const routers = express.Router();

routers.use(gameRouter);

export default routers;
