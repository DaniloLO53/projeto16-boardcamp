import express from 'express';
import { getCategories } from '../../controllers/categories.controllers.js';

const categoriesRoute = express.Router();

categoriesRoute.get('/categories', getCategories);

export default categoriesRoute;
