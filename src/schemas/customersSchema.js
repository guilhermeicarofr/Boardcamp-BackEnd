import joi from 'joi';

const customerSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().length(11).pattern(/^[0-9]+$/).required(),
    cpf: joi.string().length(11).pattern(/^[0-9]+$/).required(),
    birthday: joi.date().format('YYYY-MM-DD').required()
});

//check validations

export { customerSchema };