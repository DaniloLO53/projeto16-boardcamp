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

async function returnRent(request, response, next) {
  const { id } = request.params;

  try {
    const returnDateRaw = Date.now();
    const returnDate = dayjs(returnDateRaw).format('YYYY-MM-DD');
    const result = await db.query('SELECT * FROM rentals WHERE "id" = $1', [id]);
    const rent = result.rows[0];
    const { rentDate, daysRented, originalPrice, customerId, gameId } = rent;

    const delayDays = (returnDateRaw - rentDate) / 60 / 60 / 24 / 1000;
    const delayDaysToPay = Math.floor(delayDays) - daysRented;

    const delayFee = delayDaysToPay > 0
      ? delayDaysToPay * (originalPrice / daysRented)
      : 0;

    if (rent && !rent.returnDate) {
      await db.query(`UPDATE rentals SET
      "customerId" = $1,
      "gameId" = $2,
      "daysRented" = $3,
      "rentDate" = $4,
      "returnDate" = $5,
      "originalPrice" = $6,
      "delayFee" = $7
      WHERE "id" = $8`,
        [customerId, gameId, daysRented, rentDate, returnDate, originalPrice, delayFee, id]);

      return response.sendStatus(200);
    }

    if (rent.returnDate) return response.send(400);
    return response.send(404);


  } catch (error) {
    console.log('Error: ', error);

    return response.sendStatus(500);
  }
};

export {
  getRentals,
  insertRental,
  returnRent,
};
