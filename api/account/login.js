const jwt = require("jsonwebtoken");
const { validate, appError } = require("../../lib/mainFunctions");

module.exports = async (req, res, prisma) => {
  const {email, password} = req.body;
  
  if(!password || !email) throw appError(400);

  validate.authToken(req.signedCookies.authToken).orDie(true);

  const user = await prisma.userdata.findUnique({
    where: {
      email
    },
    select: {
      userId: true,
      password: true
    }
  });

  if(!user) throw appError(462);
  
  validate.password(password, user.password).orDie();

  const newToken = jwt.sign({_id: user.userId}, process.env.TOKEN_SECRET);

  console.log(user);

  res.cookie('authToken', newToken, {signed: true});

  return {
    data: true
  }
}