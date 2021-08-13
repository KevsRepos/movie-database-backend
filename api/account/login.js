const jwt = require("jsonwebtoken");
const { Validate, appError } = require("../../lib/mainFunctions");

module.exports = async (req, res, prisma) => {
  const {email, password} = req.body;
  
  if(!password || !email) throw appError(400);
  
  console.log('token login: ' + req.signedCookies.authToken);

  new Validate().authToken(req.signedCookies.authToken).orDie(true);
  if(req.cookies.authToken) {
    throw appError(461);
  }

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
  
  new Validate().password(password, user.password).orDie();

  const sixMonths = 15768000;

  const newToken = jwt.sign(
    {_id: user.userId}, 
    process.env.TOKEN_SECRET,
    {expiresIn: sixMonths}
  );
  res.cookie('authToken', newToken, {expires: new Date(Date.now() + sixMonths),  signed: true});

  return {
    data: true
  }
}