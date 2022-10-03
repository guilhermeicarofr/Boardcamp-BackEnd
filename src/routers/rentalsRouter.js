import { Router } from 'express';

import { readRentals, createRental } from '../controllers/rentalsControllers.js';
import { validateRental } from '../middlewares/rentalsMiddlewares.js';

const rentalsRouter = Router();

rentalsRouter.get('/rentals', readRentals);
rentalsRouter.post('/rentals', validateRental, createRental);

export { rentalsRouter };