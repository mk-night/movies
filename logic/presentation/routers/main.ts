const express = require('express');
const router = express.Router();

import { Request, Response } from 'express';

const indexController = require('../controllers/indexController');

router.get('/', (req:Request, res:Response) => {
    indexController.index(req, res);
});

router.get('/movies', (req:Request, res:Response) => {
   indexController.movies(req, res);
});

router.post('/movies/add', (req:Request, res:Response) => {
    indexController.addMovie(req, res);
});

router.all('*', (req:Request, res:Response) => {
    res.status(404).send('Not found');
});

module.exports = router;
