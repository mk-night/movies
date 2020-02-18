import {MovieDaoImpl} from "./logic/data/MovieDaoImpl";
import {MovieRepoImpl} from "./logic/data/movieRepoImpl";
import {RandomGeneratorImpl} from "./logic/data/RandomGeneratorImpl";
import * as fs from "fs";

import { ErrorRequestHandler, Request, Response, NextFunction,  } from 'express';

const dotenv = require('dotenv');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

dotenv.config();

const port = process.env.SERVER_PORT;
if (isNaN(Number(port))) {
   console.log('Port is missing. Check .env configuration!');
   process.exit(1);
}


// get the main router
const mainRouter = require('./logic/presentation/routers/main');

// create DAO - some kind of database driver
if (isNaN(Number(port))) {
   console.log('Port is missing. Check .env configuration');
   process.exit(1);
}

const databaseFilename = path.resolve(process.env.DATABASE_FILE || '');
if (!(fs.existsSync(databaseFilename) && fs.lstatSync(databaseFilename).isFile())) {
   console.log('Database file is not readable. Check .env configuration');
   process.exit(1);
}
const movieDao = new MovieDaoImpl(databaseFilename);

const randomGenerator = new RandomGeneratorImpl();
const movieRepo = new MovieRepoImpl(movieDao, randomGenerator);

app.use(bodyParser.urlencoded({extended: true}));

// put the repo to the app to be visible in controllers
app.set('movieRepo', movieRepo);
// put genres form db as predefinde genres
app.set('predefinedGenres', movieDao.genres);

// setup router
app.use('/', mainRouter);

// view engine
app.set('views', path.join(__dirname, 'web', 'views'));
app.set('view engine', 'pug');

// errors hanlder
app.use((err:ErrorRequestHandler, req:Request, res:Response, next:NextFunction) => {
   res.status(500).send('App error');
});


app.listen(port, () => {
   console.log('App started.')
});
