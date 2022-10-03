import joi from 'joi';

const rentalSchema = joi.object({
    customerId: joi.number().min(1).integer().required(),
    gameId: joi.number().min(1).integer().required(),
    daysRented: joi.number().min(1).integer().required()
});

export { rentalSchema };