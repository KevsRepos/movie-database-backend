const jwt = require("jsonwebtoken");
const { Validate } = require("../../lib/mainFunctions");

module.exports = async (req, res, prisma) => {
  const {userId} = req.body;
  var authToken = decodeURIComponent(req.signedCookies.authToken);
  
  new Validate().authToken(authToken).orDie(false);

  const decoded = jwt.decode(authToken);

  const user = await prisma.userdata.findUnique({
    where: {
      userId: userId ? userId : decoded._id
    },
    select: {
      createdAt: true,
      email: userId ? true : false,
      name: true,
      surname: true,
    }
  });

  return {
    data: user
  }
}