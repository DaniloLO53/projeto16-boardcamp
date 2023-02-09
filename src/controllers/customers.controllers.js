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

export {
  getCustomers,
}