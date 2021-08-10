const jwt = require("jsonwebtoken");
const { validate, appError } = require("../../lib/mainFunctions");

module.exports = async (req, res, prisma) => {
  if(req.body && Object.keys(req.body).length === 0 && req.body.constructor === Object) {
    throw appError(400);
  }

  Object.keys(req.body).forEach((key) => {
    if(
      key !== "email" &&
      key !== "name" &&
      key !== "surname"
    ) {
      delete req.body[key]
    }
  });

  if("email" in req.body) {
    validate.email(req.body.email).orDie();
  }

  validate.authToken(req.signedCookies.authToken).orDie();

  const decoded = jwt.verify(req.signedCookies.authToken, process.env.TOKEN_SECRET);

  await prisma.userdata.update({
    where: {
      userId: decoded._id,
    },
    data: req.body
  });
  
  return {
    return: "Informationen aktualisiert."
  }
}