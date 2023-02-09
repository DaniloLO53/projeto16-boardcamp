import express from 'express';
import {
  deleteRent,
  getRentals,
  insertRental,
  returnRent,
} from '../../controllers/rentals.controllers.js';
import rentalsValidator from '../../middlewares/rentalsValidator.middleware.js';

const rentalsRoute = express.Router();

rentalsRoute.post('/rentals', rentalsValidator, insertRental);
rentalsRoute.post('/rentals/:id/return', returnRent);
rentalsRoute.get('/rentals', getRentals);
rentalsRoute.delete('/rentals/:id', deleteRent);

export default rentalsRoute;
