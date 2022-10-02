import connection from '../database/database.js';

async function readCategories (req,res) {
    const categories = await connection.query('SELECT * FROM categories;');
    res.send(categories.rows);
}

async function createCategorie (req,res) {
    const { name } = res.locals;

    try {
        await connection.query('INSERT INTO categories (name) VALUES ($1);', [name]);
        res.sendStatus(201);        
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export { readCategories, createCategorie };