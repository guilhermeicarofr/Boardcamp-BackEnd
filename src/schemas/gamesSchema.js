import joi from 'joi';

const gameSchema = joi.object({
    name: joi.string().required(),
    image: joi.string().uri().required(),
    stockTotal: joi.number().required(),
    categoryId: joi.number().min(1).integer().required(),
    pricePerDay: joi.number().min(1).integer().required()
});

export { gameSchema };