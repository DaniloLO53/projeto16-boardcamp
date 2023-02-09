import express from 'express';
import { getGames, insertGame } from '../../controllers/games.controllers.js';

const gameRouter = express.Router();

gameRouter.get('/games', getGames);
gameRouter.post('/games', insertGame);

export default gameRouter;
