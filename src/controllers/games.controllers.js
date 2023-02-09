import { db } from "../database/database.js";

async function getGames(request, response, next) {
  try {
    const games = await db.query('SELECT * FROM games;');
    const results = games.rows;
    console.log(games);

    return response.status(200).send(results);
  } catch (error) {
    console.log(error)

    return response.sendStatus(500);
  }
};

async function insertGame(request, response, next) {
  const {
    name,
    image,
    stockTotal,
    pricePerDay,
  } = request.body;

  try {
    const gameAlreadyExists = await db.query(`SELECT * FROM games WHERE "name" = $1`,
      [name]);

    if (
      !name
      || name === ''
      || stockTotal <= 0
      || pricePerDay <= 0
    ) return response.sendStatus(400);

    if (gameAlreadyExists) return response.sendStatus(409);

    await db.query(`INSERT INTO games ("name", "image", "stockTotal", "pricePerDay")
    VALUES ($1, $2, $3, $4)`,
      [name, image, stockTotal, pricePerDay]);

    return response.sendStatus(201);

  } catch (error) {
    console.log(error)
    return response.sendStatus(500);
  }
};

export {
  getGames,
  insertGame,
}