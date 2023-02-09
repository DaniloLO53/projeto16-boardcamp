import { db } from "../database/database.js";

async function getRentals(request, response, next) {
  try {
    const results = await db.query('SELECT * FROM rentals;');
    const rentals = results.rows;
    console.log(rentals);

    return response.status(200).send(rentals);
  } catch (error) {
    console.log(error)

    return response.sendStatus(500);
  }
};

export {
  getRentals,
};
