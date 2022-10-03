import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
dayjs.extend(utc);

import connection from '../database/database.js';

async function readRentals (req,res) {
    const search = req.query;

    try {
        let rentals;
        if(search.customerId || search.gameId) {
            //check SQL INJECTION
            rentals = await connection.query(`
                SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName", games."categoryId", categories.name AS "categoryName"
                FROM rentals
                JOIN customers ON rentals."customerId"=customers.id
                JOIN games ON rentals."gameId"=games.id
                JOIN categories ON games."categoryId"=categories.id
                WHERE ${(search.customerId)? 'rentals."customerId"=' + search.customerId:''}
                ${(search.customerId && search.gameId)? ' AND ':''}
                ${(search.gameId)? 'rentals."gameId"=' + search.gameId:''};
            `);
        } else {
            rentals = await connection.query(`
                SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName", games."categoryId", categories.name AS "categoryName"
                FROM rentals
                JOIN customers ON rentals."customerId"=customers.id
                JOIN games ON rentals."gameId"=games.id
                JOIN categories ON games."categoryId"=categories.id;
            `);
        }

        res.send(rentals.rows.map(({
            id, customerId, gameId, rentDate,
            daysRented, returnDate, originalPrice, delayFee,
            customerName, gameName, categoryId, categoryName
        }) => {
            const rental = {
                id, customerId, gameId, rentDate,
                daysRented, returnDate, originalPrice, delayFee,
                customer: {
                    id: customerId,
                    name: customerName
                },
                game: {
                    id: gameId,
                    name: gameName,
                    categoryId, categoryName
                }
            };
            return rental;
        }));
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function createRental (req,res) {
    const { customerId, gameId, daysRented } = res.locals.rental;
    const rentDate = dayjs().format('YYYY-MM-DD');
    const returnDate = null;
    const delayFee = null;

    try {
        const game = await connection.query(`SELECT * FROM games WHERE id=$1 LIMIT 1;`, [gameId]);
        const originalPrice = daysRented * game.rows[0].pricePerDay;

        await connection.query(`INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "returnDate", "delayFee", "originalPrice")
                                VALUES ($1,$2,$3,$4,$5,$6,$7);`, [customerId, gameId, daysRented, rentDate, returnDate, delayFee, originalPrice]);
        res.sendStatus(201);        
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function deleteRental (req,res) {
    const id = req.params.id;

    try {
        const checkrental = await connection.query('SELECT * FROM rentals WHERE rentals.id=$1 LIMIT 1;', [id]);
        if(!checkrental.rows.length) {
            return res.sendStatus(404);
        }
        if(checkrental.rows[0].returnDate === null) {
            return res.status(400).send('rental still open');
        }

        await connection.query('DELETE FROM rentals WHERE id=$1;', [id]);
        res.sendStatus(200);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function returnRental (req,res) {
    const id = req.params.id;
    const returnDate = dayjs().format('YYYY-MM-DD');

    try {
        const checkrental = await connection.query(`SELECT rentals.*, games."pricePerDay" FROM rentals
                                                    JOIN games ON rentals."gameId"=games.id
                                                    WHERE rentals.id=$1 LIMIT 1;`, [id]);
        if(!checkrental.rows.length) {
            return res.sendStatus(404);
        }
        if(checkrental.rows[0].returnDate !== null) {
            return res.status(400).send('rental already returned');
        }

        const { daysRented, pricePerDay, rentDate } = checkrental.rows[0];
        
        let delayFee = pricePerDay * (Math.abs(dayjs(rentDate).diff(returnDate, 'day')) - daysRented);
        if(delayFee < 0) {
            delayFee = 0;
        }

        await connection.query(`UPDATE rentals
                                SET "returnDate"=$1, "delayFee"=$2
                                WHERE id=$3;`,
                                [returnDate, delayFee, id]);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export { readRentals, createRental, deleteRental, returnRental };