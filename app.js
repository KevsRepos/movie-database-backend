const express = require('express');
const cookieParser = require('cookie-parser');
const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
const cors = require('cors')
const app = express();
const port = 3005;

const corsOptions = {
  credentials: true,
  origin: 'http://localhost:3000'
};

['endpoint', 'method'].forEach((e) => app.param(e, (req, res, next, name) => {
  const modified = name.toUpperCase();

  req.name = modified;
  next();  
}));

app.use(cookieParser("secret"));
app.use(express.json());
app.use(cors(corsOptions));

const registerRoute = route => {
  const slicedRouteCrud = route.slice(-4);
  const slicedRoute = route.slice(0, -4);

  if(slicedRouteCrud === "crud") {
    registerRoute(`${slicedRoute}create`);
    registerRoute(`${slicedRoute}read`);
    registerRoute(`${slicedRoute}update`);
    registerRoute(`${slicedRoute}delete`);
    return;
  }
  
  const router = require(`.${route}`);

  app.post(route, async (req, res) => {
    try {
      const send = await router(req, res, prisma);
      res.status(200).send(send.data);
    } catch(err) {
      console.log('Dieser ERROR: ');
      console.log(err);
      if(err.httpStatusCode) {
        res.status(err.httpStatusCode).send();
      }else {
        if(err instanceof Prisma.PrismaClientValidationError) {
          res.status(400).send();
        }else {
          res.status(500).send();
        }
      }
    }
  });
}

//API Routes
registerRoute('/api/account/crud');
registerRoute('/api/account/login');
registerRoute('/api/categories/create');
registerRoute('/api/categories/read');
registerRoute('/api/movies/crud');
registerRoute('/api/movies/search');
registerRoute('/api/favorites/create');
registerRoute('/api/favorites/delete');
registerRoute('/api/favorites/read');

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});