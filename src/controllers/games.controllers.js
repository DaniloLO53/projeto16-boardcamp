import { db } from "../database/database.js";

async function getGames(request, response, next) {
  try {
    const games = await db.query('SELECT * FROM games');
    console.log(games);

    return response.sendStatus(200);
  } catch (error) {
    console.log(error)

    return response.sendStatus(500);
  }
};

async function insertGame(request, response, next) {
  try {

  } catch (error) {
    console.log(error)
    return response.sendStatus(500);
  }
};

export {
  getGames,
  insertGame,
}