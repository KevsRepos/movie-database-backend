const { validate, appError } = require("../../lib/mainFunctions");

module.exports = async (req, res, prisma) => {
  const {movieId} = req.body;
  validate.authToken(req.signedCookies.authToken).orDie();

  try {
    await prisma.movies.delete({
      where: {
        movieId
      }
    });
  } catch(err) {
    if(err.code === "P2025") throw appError(462);
  }

  return {
    return: "Film erfolgreich gelöscht."
  }
}