import express from 'express';
import {
  getRentals,
} from '../../controllers/rentals.controllers.js';

const rentalsRoute = express.Router();

rentalsRoute.get('/rentals', getRentals);

export default rentalsRoute;
