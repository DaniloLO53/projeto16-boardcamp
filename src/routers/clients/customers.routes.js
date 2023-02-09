import express from 'express';
import {
  getCustomer,
  getCustomers,
  insertCustomer,
  updateCustomer
} from '../../controllers/customers.controllers.js';
import customersValidator from '../../middlewares/customersValidator.middleware.js';

const customersRoute = express.Router();

customersRoute.post('/customers', customersValidator, insertCustomer);
customersRoute.get('/customers', getCustomers);
customersRoute.get('/customers/:id', getCustomer);
customersRoute.put('/customers/:id', customersValidator, updateCustomer);

export default customersRoute;
