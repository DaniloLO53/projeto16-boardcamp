import { db } from "../database/database.js";

async function getCategories(request, response, next) {
  const { offset, limit } = request.query;
  let query = `SELECT * FROM categories`;

  if (offset && !limit) {
    query += ` OFFSET '${offset}'`;
  }
  if (!offset && limit) {
    query += ` LIMIT '${limit}'`;
  }
  if (offset && limit) {
    query += ` OFFSET '${offset}'
    LIMIT '${limit}'`;
  }

  try {
    const results = await db.query(query);
    const categories = results.rows;

    return response.status(200).send(categories);
  } catch (error) {
    console.log('Error: ', error);

    return response.sendStatus(500);
  }
};

export {
  getCategories,
};
