const { validate } = require("../../lib/mainFunctions");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, prisma) => {
  const {userId} = req.body;

  validate.authToken(req.signedCookies.authToken).orDie();

  const decoded = jwt.verify(req.signedCookies.authToken, process.env.TOKEN_SECRET);

  const favoritesByUserId = async id => await prisma.favorites.findMany({
    where: {
      userId: id
    },
    select: {
      movieId: true
    }
  });

  let favorites;

  favorites = await favoritesByUserId(userId ? userId : decoded._id)
    .catch(err => {
      console.log(err);
    });

  let favoriteMovies = [];

  for (let i = 0; i < favorites.length; i++) {
    const movie = await prisma.movies.findUnique({
      where: {
        movieId: favorites[i].movieId
      },
      select: {
        name: true
      }
    });

    favoriteMovies.push(movie);
  }

  return {
    data: favoriteMovies
  }
}