import { Router } from 'express';

import { readRentals, createRental, deleteRental } from '../controllers/rentalsControllers.js';
import { validateRental } from '../middlewares/rentalsMiddlewares.js';

const rentalsRouter = Router();

rentalsRouter.get('/rentals', readRentals);
rentalsRouter.post('/rentals', validateRental, createRental);
rentalsRouter.delete('/rentals/:id', deleteRental);

export { rentalsRouter };