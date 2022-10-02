import connection from '../database/database.js';

import { categorieSchema } from '../schemas/categoriesSchema.js';

async function validateCategorie (req,res,next) {
    const categorie = req.body;

    const validation = categorieSchema.validate(categorie, { abortEarly: false });
    if(validation.error) {
        console.log(validation.error.details);
        return res.status(400).send(validation.error.details.map((item)=>item.message));
    }

    try {
        const checkname = await connection.query('SELECT * FROM categories WHERE name=$1', [categorie.name]);
        if(checkname.rows.length) {
            return res.sendStatus(409);
        }
        res.locals.name = categorie.name;
        next();
    } catch(error) {
        console.log(error);
        res.sendStatus(500);        
    }
}

export { validateCategorie };