import connection from '../database/database.js';

import { gameSchema } from '../schemas/gamesSchema.js';

async function validateGame (req,res,next) {
    const game = req.body;

    const validation = gameSchema.validate(game, { abortEarly: false });
    if(validation.error) {
        console.log(validation.error.details);
        return res.status(400).send(validation.error.details.map((item)=>item.message));
    }

    try {
        const checkcategorie = await connection.query('SELECT * FROM categories WHERE id=$1', [game.categoryId]);
        if(!checkcategorie.rows.length) {
            return res.status(400).send('categoryId must be a valid category');
        }

        const checkname = await connection.query('SELECT * FROM games WHERE name=$1', [game.name]);
        if(checkname.rows.length) {
            return res.sendStatus(409);
        }
        res.locals.game = game;
        next();
    } catch(error) {
        console.log(error);
        res.sendStatus(500);        
    }
}

export { validateGame };