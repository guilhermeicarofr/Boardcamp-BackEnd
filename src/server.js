import express from 'express';
import cors from 'cors';

import connection from './database/database.js';

const server = express();
server.use(express.json());
server.use(cors());

server.get('/test', async (req,res) => {
    const games = await connection.query('SELECT * FROM games;');
    res.send(games.rows);
})

server.listen(4000, () => {
    console.log('Server listening on port 4000...');
  });