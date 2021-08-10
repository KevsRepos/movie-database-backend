const { Prisma } = require("@prisma/client");
const { validate, appError } = require("../../lib/mainFunctions");
const createCategory = require('../categories/create');

module.exports = async (req, res, prisma) => {
  const {movieId, toUpdate} = req.body;

  Object.keys(toUpdate).forEach(key => {
    if(
      key !== "name" &&
      key !== "category" &&
      key !== "releaseDate" &&
      key !== "movieLength" &&
      key !== "description"
    ) {
      delete req.body[key]
    }
  });

  if(Object.keys(toUpdate).length === 0) {
    throw appError(400);
  }

  validate.authToken(req.signedCookies.authToken).orDie();

  if("category" in toUpdate) {
    const getCategory = await prisma.categories.findUnique({
      where: {
        categoryId: toUpdate.category
      }
    });
  
    if(!getCategory) {

      await createCategory({
        signedCookies: {
          authToken: req.signedCookies.authToken
        },
        body: toUpdate
      }, res, prisma);
    }
  }

  try {
    await prisma.movies.update({
      where: {
        movieId
      },
      data: toUpdate
    });

  } catch(err) {
    console.log(err);
    if(err instanceof Prisma.PrismaClientValidationError) throw appError(400);
    if(err.code === "P2025") throw appError(462);
  }

  return {
    return: "Film wurde aktualisiert."
  }
}