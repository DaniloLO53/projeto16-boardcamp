import customersSchema from "../schemas/customers.schema.js";

function customersValidator(request, response, next) {
  const customer = request.body;

  try {
    const validation = customersSchema.validate(customer);

    if (validation.error) {
      console.log('Error on validation: ', validation.error.message)

      return response.sendStatus(400);
    }

    next();
  } catch (error) {
    console.log('Error: ', error);

    return response.sendStatus(500);
  }
};

export default customersValidator;
