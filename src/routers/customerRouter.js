import { Router } from 'express';

import { readCustomers, readOneCustomer, createCustomer } from '../controllers/customersControllers.js';
//import { validateCustomer } from '../middlewares/customersMiddlewares.js';

const customersRouter = Router();

customersRouter.get('/customers', readCustomers);
customersRouter.get('/customers/:id', readOneCustomer);
//customersRouter.post('/customers', validateCustomer, createCustomer);

export { customersRouter };