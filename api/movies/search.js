const { appError } = require("../../lib/mainFunctions");

module.exports = async (req, res, prisma) => {
  const {value} = req.body;

  console.log('search goes on')
  console.log(value);

  const searchedMovies = await prisma.movies.findMany({
    where: {
      name: {
        contains: value
      }
    }
  });

  if(Object.keys(searchedMovies).length === 0) {
    throw appError(462);
  }
  
  return {
    data: searchedMovies
  }
}