import connection from '../database/database.js';

import { rentalSchema } from '../schemas/rentalsSchema.js';

async function validateRental (req,res,next) {
    const rental = req.body;

    const validation = rentalSchema.validate(rental, { abortEarly: false });
    if(validation.error) {
        console.log(validation.error.details);
        return res.status(400).send(validation.error.details.map((item)=>item.message));
    }

    try {
        const checkcustomer = await connection.query('SELECT * FROM customers WHERE id=$1 LIMIT 1', [rental.customerId]);
        if(!checkcustomer.rows.length) {
            return res.status(400).send('customerId must be a valid customer');
        }
        const checkgame = await connection.query('SELECT * FROM games WHERE id=$1 LIMIT 1', [rental.gameId]);
        if(!checkgame.rows.length) {
            return res.status(400).send('gameId must be a valid game');
        }
        const checkrentals = await connection.query('SELECT * FROM rentals WHERE rentals."gameId"=$1 AND rentals."returnDate" IS NULL;', [rental.gameId]);
        if(checkrentals.rows.length >= checkgame.rows[0].stockTotal) {
            return res.status(400).send('game not available');
        }

        res.locals.rental = rental;
        next();
    } catch(error) {
        console.log(error);
        res.sendStatus(500);        
    }
}

export { validateRental };