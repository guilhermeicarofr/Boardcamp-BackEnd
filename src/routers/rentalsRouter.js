import { Router } from 'express';

import { readRentals } from '../controllers/rentalsControllers.js';
//import { validateGame } from '../middlewares/gamesMiddlewares.js';

const rentalsRouter = Router();

rentalsRouter.get('/rentals', readRentals);
//gamesRouter.post('/games', validateGame, createGame);

export { rentalsRouter };