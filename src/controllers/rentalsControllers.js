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

export { readRentals, createRental };