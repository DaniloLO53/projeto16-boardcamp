import { db } from "../database/database.js";

async function getCustomers(request, response, next) {
  try {
    const customers = await db.query('SELECT * FROM customers;');
    const results = customers.rows;
    console.log(customers);

    return response.status(200).send(results);
  } catch (error) {
    console.log(error)

    return response.sendStatus(500);
  }
};

async function insertCustomer(request, response, next) {
  const {
    name,
    phone,
    cpf,
    birthday,
  } = request.body;

  try {
    const customerAlreadyExists = await db.query(`SELECT * FROM customers WHERE "cpf" = $1`,
      [cpf]);

    if (customerAlreadyExists.rowCount !== 0) return response.sendStatus(409);

    await db.query(`INSERT INTO customers ("name", "phone", "cpf", "birthday")
    VALUES ($1, $2, $3, $4)`,
      [name, phone, cpf, birthday]);

    return response.sendStatus(201);

  } catch (error) {
    console.log(error)
    return response.sendStatus(500);
  }
};

export {
  getCustomers,
  insertCustomer,
};
