import express from 'express';
import cors from 'cors';

import connection from './database/database.js';

const server = express();
server.use(express.json());
server.use(cors());



server.listen(4000, () => {
    console.log('Server listening on port 4000...');
  });