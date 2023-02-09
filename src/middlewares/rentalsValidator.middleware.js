import rentalsSchema from "../schemas/rentals.schema.js";
import { db } from "../database/database.js";

async function rentalsValidator(request, response, next) {
  const rental = request.body;

  try {
    const { customerId, gameId } = rental;
    const validation = rentalsSchema.validate(rental, { abortEarly: false });

    if (validation.error) {
      console.log('Error on validation: ', validation.error)
      return response.sendStatus(400);
    }

    const resultFromCustomers = await db.query('SELECT * FROM customers WHERE "id" = $1',
      [customerId]);
    const resultFromGames = await db.query('SELECT * FROM games WHERE "id" = $1',
      [gameId]);
    const resultsFromRentals = await db.query('SELECT * FROM rentals WHERE "gameId" = $1;',
      [gameId]);


    const { stockTotal } = resultFromGames.rows[0];

    if (resultFromCustomers.rows.length === 0) {
      console.log('Customer does not exists');
      return response.sendStatus(400);
    }

    if (resultFromGames.rows.length === 0) {
      console.log('Game does not exists');
      return response.sendStatus(400);
    }

    if (stockTotal - 1 < resultsFromRentals.rows.length) {
      console.log('Out of stock');
      return response.sendStatus(400);
    }

    next();
  } catch (error) {
    console.log('Error: ', error);

    return response.sendStatus(500);
  }
};

export default rentalsValidator;
