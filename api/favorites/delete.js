const { Prisma } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const { validate, appError } = require("../../lib/mainFunctions");

module.exports = async (req, res, prisma) => {
  const {movieId} = req.body;

  validate.authToken(req.signedCookies.authToken).orDie();

  const decoded = jwt.verify(req.signedCookies.authToken, process.env.TOKEN_SECRET);

  try {
    await prisma.favorites.deleteMany({
      where: {
        userId: decoded._id,
        movieId
      }
    });
  } catch(err) {
    console.log(err);
    if(err instanceof Prisma.PrismaClientValidationError) throw appError(400);
  }

  return {
    return: "Favorit entfernt."
  }
}