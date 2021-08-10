const jwt = require("jsonwebtoken");
const { validate, appError } = require("../../lib/mainFunctions");

module.exports = async (req, res, prisma) => {
  const {password} = req.body;

  validate.authToken(req.signedCookies.authToken).orDie();
  
  const decoded = jwt.verify(req.signedCookies.authToken, process.env.TOKEN_SECRET);

  const user = await prisma.userdata.findUnique({
    where: {
      userId: decoded._id
    }
  });

  if(!user) {
    res.cookie('authToken', {expires: Date.now()});
    throw appError(461);
  }

  validate.password(password, user.password).orDie();

  await prisma.userdata.delete({
    where: {
      userId: decoded._id
    }
  });

  return {
    return: "Account erfolgreich gelöscht!"
  }
}