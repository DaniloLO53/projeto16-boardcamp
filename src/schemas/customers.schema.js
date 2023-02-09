import Joi from 'joi';

const cpfPattern = /^\d{11}$/;
const phonePattern = /^\d{10,11}$/;
const birthdayPattern = /^\d{4}-\d{2}-\d{2}$/

const customersSchema = Joi.object({
  cpf: Joi
    .string().trim()
    .regex(new RegExp(cpfPattern))
    .error((error) => new Error(error))
    .required(),
  phone: Joi
    .string().trim()
    .regex(new RegExp(phonePattern))
    .error((error) => new Error(error))
    .required(),
  name: Joi
    .string().trim()
    .min(1)
    .error((error) => new Error(error))
    .required(),
  birthday: Joi
    .string().trim()
    .error((error) => new Error(error))
    .regex(new RegExp(birthdayPattern))
    .required(),
});

export default customersSchema;
