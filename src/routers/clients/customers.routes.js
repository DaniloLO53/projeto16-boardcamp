import express from 'express';
import { getCustomers, insertCustomer } from '../../controllers/customers.controllers.js';
import customersValidator from '../../middlewares/customersValidator.middleware.js';

const customersRouter = express.Router();

customersRouter.post('/customers', customersValidator, insertCustomer);
customersRouter.get('/customers', getCustomers);

export default customersRouter;
