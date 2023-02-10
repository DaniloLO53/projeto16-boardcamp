import { db } from "../database/database.js";

async function updateCustomer(request, response, next) {
  const {
    name,
    phone,
    cpf,
    birthday,
  } = request.body;
  const { id } = request.params;

  try {
    const customerAlreadyExists = await db.query(`SELECT * FROM customers WHERE "id" = $1`,
      [id]);
    const customerWithCpf = await db.query(`SELECT * FROM customers
      WHERE "cpf" = $1 AND "id" != $2`,
      [cpf, id]);

    if (
      customerAlreadyExists.rowCount === 0
      || customerWithCpf.rowCount !== 0
    ) return response.sendStatus(409);

    await db.query(`UPDATE customers SET 
      "name" = $1,
      "phone" = $2,
      "cpf" = $3,
      "birthday" = $4
      WHERE "id" = $5`,
      [name, phone, cpf, birthday, id]);

    return response.sendStatus(200);

  } catch (error) {
    console.log(error)
    return response.sendStatus(500);
  }
};

async function getCustomer(request, response, next) {
  const { id } = request.params;
  try {
    const result = await db.query('SELECT * FROM customers WHERE "id" = $1', [id]);
    const customer = result.rows[0];

    if (!customer) return response.sendStatus(404);

    return response.status(200).send(customer);
  } catch (error) {
    console.log('Error: ', error);

    return response.sendStatus(500);
  }
};

async function getCustomers(request, response, next) {
  const { cpf, offset, limit, order, desc } = request.query;
  let query = `SELECT * FROM customers`;

  if (cpf) {
    query += ` WHERE cpf LIKE '${cpf}_%'`;
  }
  if (order) {
    query += ` ORDER BY ${order} ${desc ? 'DESC' : ''}`;
  }
  if (offset) {
    query += ` OFFSET ${offset}`;
  }
  if (limit) {
    query += ` LIMIT ${limit}`;
  }

  try {
    const customers = await db.query(query);
    const results = customers.rows;

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
  getCustomer,
  insertCustomer,
  updateCustomer,
};
