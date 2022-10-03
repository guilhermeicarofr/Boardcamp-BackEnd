import { Router } from 'express';

import { readRentals, createRental, deleteRental, returnRental } from '../controllers/rentalsControllers.js';
import { validateRental } from '../middlewares/rentalsMiddlewares.js';

const rentalsRouter = Router();

rentalsRouter.get('/rentals', readRentals);
rentalsRouter.post('/rentals', validateRental, createRental);
rentalsRouter.delete('/rentals/:id', deleteRental);
rentalsRouter.post('/rentals/:id/return', returnRental)

export { rentalsRouter };