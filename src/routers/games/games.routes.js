import express from 'express';
import { getGames, insertGame } from '../../controllers/games.controllers.js';

const gamesRoute = express.Router();

gamesRoute.get('/games', getGames);
gamesRoute.post('/games', insertGame);

export default gamesRoute;
