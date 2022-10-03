import { Router } from 'express';

import { readCustomers, readOneCustomer, createCustomer, updateCustomer } from '../controllers/customersControllers.js';
import { validateCustomer } from '../middlewares/customersMiddlewares.js';

const customersRouter = Router();

customersRouter.get('/customers', readCustomers);
customersRouter.get('/customers/:id', readOneCustomer);
customersRouter.post('/customers', validateCustomer, createCustomer);
customersRouter.put('/customers/:id', validateCustomer, updateCustomer);

export { customersRouter };