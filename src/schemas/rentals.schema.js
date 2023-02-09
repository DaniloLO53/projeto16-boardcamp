import Joi from 'joi';

const rentalsSchema = Joi.object({
  customerId: Joi
    .number()
    .error((error) => new Error(error))
    .required(),
  gameId: Joi
    .number()
    .error((error) => new Error(error))
    .required(),
  daysRented: Joi
    .number()
    .min(1)
    .error((error) => new Error(error))
    .required(),
});

export default rentalsSchema;
