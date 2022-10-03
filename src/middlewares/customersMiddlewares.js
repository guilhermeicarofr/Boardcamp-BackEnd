import connection from '../database/database.js';

import { customerSchema } from '../schemas/customersSchema.js';

async function validateCustomer (req,res,next) {
    const customer = req.body;
    const id = req.params?.id;

    console.log(req);

    const validation = customerSchema.validate(customer, { abortEarly: false });
    if(validation.error) {
        console.log(validation.error.details);
        return res.status(400).send(validation.error.details.map((item)=>item.message));
    }

    try {
        const checkcpf = await connection.query('SELECT * FROM customers WHERE cpf=$1;', [customer.cpf]);
        if(checkcpf.rows.length) {
            if(req.method==='PUT' && id && checkcpf.rows.filter(item => item.id == id).length) {
                console.log('update');
            } else {
                return res.sendStatus(409);
            }
        }

        res.locals.customer = customer;
        next();
    } catch(error) {
        console.log(error);
        res.sendStatus(500);        
    }
}

export { validateCustomer };