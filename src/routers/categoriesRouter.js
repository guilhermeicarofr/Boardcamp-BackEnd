import { Router } from 'express';

import { readCategories, createCategorie } from '../controllers/categoriesControllers.js';
import { validateCategorie } from '../middlewares/categoriesMiddlewares.js';

const categoriesRouter = Router();

categoriesRouter.get('/categories', readCategories);
categoriesRouter.post('/categories', validateCategorie, createCategorie);

export { categoriesRouter };