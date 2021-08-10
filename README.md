# movie-database-backend
This is the backend for https://github.com/KevsRepos/movie-database

## HOW TO RUN ##
Run this in a NodeJS Enviroment and use following command:
> node app.js

# Database initialisation
This project uses the prisma client
https://www.npmjs.com/package/@prisma/client
on a mysql database.

# Some explanation

Yeah I know, this looks weird, doesnt it? This is an experimental try of a new structure for backend development.
On the top level is a `registerRoute` function, which registers in a more automatic style every given routes. To keep this
as simple as a possible task, I only use the *POST* http Method. This way I can create a folder structure, which follows
common frontend folder-structure patterns. Creating an API is kept as easy as possible, when following in a few simple rules.

Instead of using http methods do define what exactly should happen, you use catch words on the end of a URI:

*create* - is meant to create specific data in a database, comparable to the *POST* method.

*read* - you would normally use *GET* for receaving data from a database. Here you must use the body to send parameters.

*update* - updates data. Normal people use put/patch for this.

*delete* - the comparable http method literally calls *DELETE*. Self explaining.

additionally:

*login* - to verify some sort of data and send back some sort of a validation token.

*search* - to specifically make search requests, which mostly require way different database queries.

This way you instantly know all the routes and what they do by just looking at the folder structure.

# Is this a good approach?
It is experimental. Would always use common patterns in not so experimental projects. 
Wouldnt explicitly say this is a good approach, but it maybe leads to think of something better
