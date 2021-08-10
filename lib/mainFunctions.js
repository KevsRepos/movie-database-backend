const jwt  = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const appError = module.exports.appError = (httpStatusCode = 500) => {
  return {
    httpStatusCode: httpStatusCode
  }
}

const validate = {
  is: null,
  errStatus: 500,
  orDie: (onBool = false) => {
    if(onBool) {
      if(validate.is) throw appError(validate.errStatus);
    }else {
      if(!validate.is) throw appError(validate.errStatus);
    }
  },
  email: emailAdress => {
    validate.errStatus = 400;
    
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(!re.test(String(emailAdress).toLowerCase())) {
      validate.is = false;
    }else {
      validate.is = true;
    }
    return validate;
  },
  authToken: token => {
    validate.errStatus = 461;
    try {
      jwt.verify(token, process.env.TOKEN_SECRET);

      validate.is = true;
    } catch(err) {
      validate.is = false;
    }

    return validate;
  },
  password: (password, hash) => {
    validate.errStatus = 464;
    if(!bcrypt.compareSync(password, hash)) {
      validate.is = false;
    }else {
      validate.is = true;
    }
    
    return validate;
  }
}

module.exports.validate = validate;

module.exports.validateJsonOrDie = (...keys) => {
  keys.forEach(index => {
    if(Array.isArray(index[0]) || !index[0] || typeof index[0] !== index[1]) throw appError(400);
  });
  return;
}