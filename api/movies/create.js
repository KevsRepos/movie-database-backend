const { v4: uuidv4 } = require('uuid');
const createCategory = require('../categories/create');
const { validate, appError } = require("../../lib/mainFunctions");
const { Prisma } = require('@prisma/client');

module.exports = async (req, res, prisma) => {
  const {name, category, releaseDate, movieLength, description} = req.body;

  validate.authToken(req.signedCookies.authToken).orDie();

  const getCategory = await prisma.categories.findUnique({
    where: {
      categoryId: category
    }
  });

  if(!getCategory) {
    await createCategory(req, res, prisma);
  }

  try {
    await prisma.movies.create({
      data: {
        movieId: uuidv4(),
        name,
        category,
        releaseDate,
        movieLength,
        description
      }});
  }catch(err) {
    if(err instanceof Prisma.PrismaClientValidationError) throw appError(400);
    if(err.code === "P2002") throw appError(463);
  }

  return {
    return: "Film erfolgreich erstellt."
  }
}