module.exports = async (req, res, prisma) => {
  const {pagination} = req.body;

  prisma.movies.findMany({
    skip: pagination,
    take: 50
  });
  
  return {
    return: `Alle Filme aus der Kategorie ${category}`,
    data: moviesFromCategory
  }
}