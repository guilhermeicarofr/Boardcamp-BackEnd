import express from 'express';
import cors from 'cors';

import { categoriesRouter } from './routers/categoriesRouter.js';
import { gamesRouter } from './routers/gamesRouter.js';

const server = express();
server.use(express.json());
server.use(cors());

server.use(categoriesRouter);
server.use(gamesRouter);











server.listen(4000, () => {
    console.log('Server listening on port 4000...');
  });