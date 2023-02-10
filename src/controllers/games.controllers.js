import { db } from "../database/database.js";

async function getGames(request, response, next) {
  const { name } = request.query;
  let query = `SELECT * FROM games`;

  if (name) {
    query += ` WHERE LOWER(name) LIKE LOWER('${name}_%')`;
  }

  try {
    const games = await db.query(query);
    const results = games.rows;

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

    console.log(gameAlreadyExists)

    if (
      !name
      || name === ''
      || stockTotal <= 0
      || pricePerDay <= 0
    ) return response.sendStatus(400);

    if (gameAlreadyExists.rowCount !== 0) return response.sendStatus(409);

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