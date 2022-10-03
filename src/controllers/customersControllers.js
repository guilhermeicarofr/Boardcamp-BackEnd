import connection from '../database/database.js';

async function readCustomers (req,res) {
    const search = req.query;

    try {
        if(search.cpf) {
            //check SQL INJECTION
            const customers = await connection.query(`SELECT *
                                                FROM customers
                                                WHERE customers.cpf
                                                LIKE '${search.cpf}%';`);
            return res.send(customers.rows);
        }
    
        const customers = await connection.query(`SELECT * FROM customers;`);
        res.send(customers.rows);        
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function readOneCustomer (req,res) {
    const { id } = req.params;

    try { 
        const customers = await connection.query(`SELECT * FROM customers WHERE id=$1 LIMIT 1;`, [id]);

        if(!customers.rows.length) {
            return res.sendStatus(404);
        }
        res.send(customers.rows);        
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function createCustomer (req,res) {
    const { name, phone, cpf, birthday  } = res.locals.customer;

    try {
        await connection.query(`INSERT INTO customers (name, phone, cpf, birthday)
                                VALUES ($1,$2,$3,$4);`, [name, phone, cpf, birthday]);
        res.sendStatus(201);        
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
}














export { readCustomers, readOneCustomer, createCustomer };