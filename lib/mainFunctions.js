const jwt  = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const appError = module.exports.appError = (httpStatusCode = 500) => {
  return {
    httpStatusCode: httpStatusCode
  }
}

class Validate {
  constructor() {
    this.is = null;
    this.errStatus = 500
  }

  orDie(onBool = false) {
    if(onBool) {
      if(this.is) throw appError(this.errStatus);
    }else {
      if(!this.is) throw appError(this.errStatus);
    }
  }

  email(emailAdress) {
    this.errStatus = 400;
    
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(!re.test(String(emailAdress).toLowerCase())) {
      this.is = false;
    }else {
      this.is = true;
    }
    return this;
  }

  authToken(token) {
    this.errStatus = 461;
    try {
      console.log(atob(token));

      jwt.verify(atob(token), process.env.TOKEN_SECRET);

      this.is = true;
    } catch(err) {
      console.log(err);
      this.is = false;
    }

    return this;
  }

  password(password, hash) {
    this.errStatus = 464;
    if(!bcrypt.compareSync(password, hash)) {
      this.is = false;
    }else {
      this.is = true;
    }
    
    return this;
  }
}

module.exports.Validate = Validate;

module.exports.validateJsonOrDie = (...keys) => {
  keys.forEach(index => {
    if(Array.isArray(index[0]) || !index[0] || typeof index[0] !== index[1]) throw appError(400);
  });
  return;
}