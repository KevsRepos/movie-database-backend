const { validate, appError } = require("../../lib/mainFunctions");

module.exports = async (req, res, prisma) => {
  const {category} = req.body;

  if(!category) throw appError(400);
  
  validate.authToken(req.signedCookies.authToken).orDie();

  const createCategory = async () => await prisma.categories.create({
    data: {
      categoryId: category
    }
  });

  await createCategory()
    .catch(err => {
      console.log(err);
      if(err.code === "P2002") throw appError(463);
      else throw appError();
    });

  return {
    return: "Kategorie erfolgreich erstellt."
  }
}