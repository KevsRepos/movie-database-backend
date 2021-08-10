const {appError, validate} = require('../../lib/mainFunctions');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, prisma) => {
  const {email, surname, name, password} = req.body;

  validate.email(email).orDie(false);

  validate.authToken(req.signedCookies.authToken).orDie(true);
  
  const hash = await bcrypt.hash(password, 10);
  const userID = uuidv4();

  const createUser = async () => await prisma.userdata.create({
    data: { 
      userId: userID,
      email: email,
      surname: surname, 
      name: name,
      password: hash
    }
  });

  await createUser()
  .catch(e => {
    console.log(e);
    if(e.code === "P2002") throw appError(460)
    else throw appError();
  });

  console.log(process.env.TOKEN_SECRET);
  console.log("userID: " + userID);
  const newToken = jwt.sign({_id: userID}, process.env.TOKEN_SECRET);

  console.log(newToken);

  res.cookie('authToken', newToken, {signed: true});
  // s%3A string gehört nicht dahin.
  return {
    data: {}
  };
}