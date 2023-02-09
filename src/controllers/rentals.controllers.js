import { db } from "../database/database.js";
import dayjs from 'dayjs';

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

async function insertRental(request, response, next) {
  const {
    customerId,
    gameId,
    daysRented
  } = request.body;

  try {
    const rentDate = dayjs(Date.now()).format('YYYY-MM-DD');
    const resultFromGames = await db.query('SELECT * FROM games WHERE "id" = $1',
      [gameId]);

    const { pricePerDay } = resultFromGames.rows[0];
    const originalPrice = pricePerDay * daysRented;

    await db.query(`INSERT INTO rentals
    ("customerId",
    "gameId",
    "daysRented",
    "rentDate",
    "returnDate",
    "originalPrice",
    "delayFee")
    VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [customerId, gameId, daysRented, rentDate, null, originalPrice, null]);

    return response.sendStatus(201);

  } catch (error) {
    console.log(error)
    return response.sendStatus(500);
  }
};

export {
  getRentals,
  insertRental,
};
