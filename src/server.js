import express from 'express';
import cors from 'cors';

import connection from './database/database.js';

const server = express();
server.use(express.json());
server.use(cors());

server.get('/categories', async (req,res) => {
    const categories = await connection.query('SELECT * FROM categories;');
    res.send(categories.rows);
});

server.post('/categories', async (req,res) => {


    //middleware
    const categorie = req.body;

    //change to joi schema
    if(!categorie.name) {
        return res.sendStatus(400);
    }

    try {
        const checkname = await connection.query('SELECT * FROM categories WHERE name=$1', [categorie.name]);
        if(checkname.rows.length) {
            return res.sendStatus(409);
        }
        res.locals.name = categorie.name;
        //next();
    } catch(error) {
        console.log(error);
        res.sendStatus(500);        
    }


    //controller
    const { name } = res.locals;

    try {
        await connection.query('INSERT INTO categories (name) VALUES ($1);', [name]);
        res.sendStatus(201);        
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }

});











server.listen(4000, () => {
    console.log('Server listening on port 4000...');
  });