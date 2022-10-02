import { Router } from 'express';

import { readGames, createGame } from '../controllers/gamesControllers.js';
import { validateGame } from '../middlewares/gamesMiddlewares.js';

const gamesRouter = Router();

gamesRouter.get('/games', readGames);
gamesRouter.post('/games', validateGame, createGame);

export { gamesRouter };