import { db } from "../database/database.js";
import dayjs from 'dayjs';

async function getRentals(request, response, next) {
  const { gameId, customerId, offset, limit, order, desc, status, startDate } = request.query;
  let query = `SELECT * FROM rentals`;
  const conditions = [];

  if (gameId) {
    conditions.push(`"gameId" = '${gameId}'`);
  }
  if (customerId) {
    conditions.push(`"customerId" = '${customerId}'`);
  }
  if (status === 'open') {
    conditions.push(`"returnDate" IS NULL`);
  }
  if (status === 'closed') {
    conditions.push(`"returnDate" IS NOT NULL`);
  }
  if (startDate) {
    conditions.push(`"rentDate" >= '${startDate}'`);
  }
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }
  if (order) {
    query += ` ORDER BY "${order}" ${desc ? 'DESC' : ''}`;
  }
  if (offset) {
    query += ` OFFSET ${offset}`;
  }
  if (limit) {
    query += ` LIMIT ${limit}`;
  }

  try {
    const results = await db.query(query);
    const resultFromGames = await db.query('SELECT * FROM games;');
    const resultFromCustomers = await db.query('SELECT * FROM customers;');

    const rentals = results.rows;

    const customerObject = rentals.map(({ customerId, gameId }) => {
      const { id: idCostumer, name: nameCostumer } = resultFromCustomers.rows.find(({ id }) => id === customerId);
      const { id: idGame, name: nameGame } = resultFromGames.rows.find(({ id }) => id === gameId);
      const final = {
        customer: {
          "id": idCostumer,
          "name": nameCostumer,
        },
        game: {
          "id": idGame,
          "name": nameGame,
        }
      }

      return final;
    });
    const modifiedRentals = rentals.map((object) => {
      const respectiveCustomerObject = customerObject.find(({ customer }) => customer.id === object.customerId);

      const newRental = {
        ...object,
        ...respectiveCustomerObject,
      };

      return newRental;
    });

    return response.status(200).send(modifiedRentals);
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
    const resultFromCustomers = await db.query('SELECT * FROM games WHERE "id" = $1',
      [customerId]);

    if (
      resultFromGames.rows[0] === 0
      || resultFromCustomers.rows[0] === 0)
      return response.sendStatus(400);

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

    if (!rent) return response.send(404);

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


  } catch (error) {
    console.log('Error: ', error);

    return response.sendStatus(500);
  }
};

async function deleteRent(request, response, next) {
  const { id } = request.params;

  try {
    const result = await db.query('SELECT * FROM rentals WHERE "id" = $1', [id]);
    const rent = result.rows[0];

    if (!rent) return response.send(404);

    if (rent && rent.returnDate) {
      await db.query('DELETE FROM rentals WHERE "id" = $1', [id]);

      return response.sendStatus(200);
    }

    if (!rent.returnDate) return response.sendStatus(400);

  } catch (error) {
    console.log('Error: ', error);

    return response.sendStatus(500);
  }
};

export {
  getRentals,
  insertRental,
  returnRent,
  deleteRent,
};
