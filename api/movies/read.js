module.exports = async (req, res, prisma) => {
  const {category, movie} = req.body;

  let pagination = req.body.pagination;

  if(!pagination) pagination = 0;

  if(category) {
    const moviesByCategory = await prisma.movies.findMany({
      skip: pagination,
      take: 50,
      where: {
        category: category
      }
    });

    return {
      data: moviesByCategory
    }
  }else if(movie) {
    const specificMovie = await prisma.movies.findUnique({
      where: {
        name: movie
      }
    });

    return {
      data: specificMovie
    }
  }else {
    const movies = await prisma.movies.findMany({
      skip: pagination,
      take: 50
    });

    return {
      data: movies
    }
  }
}