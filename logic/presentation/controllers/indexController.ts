import {Movie} from "../../data/movie";
import { Request, Response } from 'express';

const movieService = require('../../data/movieService');

exports.index = (req:Request, res:Response) => {
    res.render('index', { title: 'Movies Library' });
};

exports.movies = (req:Request, res:Response) => {

    // parse genres parameter
    const genresBody = req.body.genres;
    const genres = parseGenreString(genresBody);

    // parse duration parameter
    let duration: number | undefined = Number(req.body.duration);
    if (isNaN(duration) || duration < 1) {
        duration = undefined;
    }

    const movies = movieService.getMovies(req.app, genres, duration);
    res.json(movies);
};

exports.addMovie = (req:Request, res:Response) => {
    let validationErrors: string[] = [];

    // Get and validate genres
    const genresBody = req.body.genres;
    const genres = parseGenreString(genresBody);
    if (genres == undefined || genres.length < 1) {
        validationErrors.push('List of genres is required');
    } else {
        // check if genres are only form allowed list
        const predefinedGenres: string[] = req.app.get('predefinedGenres');
        const areOnlyFromPredefined = genres.every((genre) => {
            return predefinedGenres.includes(genre);
        });
        if (!areOnlyFromPredefined) {
            validationErrors.push('List of genres should contain only predefined genres');
        }
    }

    // Get and validate title
    const title = req.body.title;
    if (title == undefined || title.length < 1 || title.length > 255) {
        validationErrors.push('Title is required and must be max 255 characters long');
    }
    // Get and validate year
    const year = req.body.year;
    if (year == undefined || isNaN(Number(year))) {
        validationErrors.push('Year is required and must be a number');
    }
    // Get and validate runtime
    const runtime = req.body.runtime;
    if (runtime == undefined || isNaN(Number(runtime))) {
        validationErrors.push('Runtime is required and must be a number');
    }
    // Get and validate title
    const director = req.body.director;
    if (director == undefined || director.length < 1 || director.length > 255) {
        validationErrors.push('Director is required and must be max 255 characters long');
    }
    // Get optional parameters
    const actors = req.body.actors;
    const plot = req.body.plot;
    const posterUrl = req.body.posterUrl;

    if (validationErrors.length == 0) {
        const movie = new Movie(title, year, runtime, genres, director, actors, plot, posterUrl);
        movieService.addMovie(req.app, movie);
        res.status(201).send('');
    } else {
        res.status(422).send(validationErrors.join('\n'));
    }

};

function parseGenreString(s: string) : string[] {
    let items: string[] = [];
    if (s != undefined) {
        items = s.split(',');
        items.forEach((item, index) => {
            items[index] = item.trim();
        });
    }
    return items;
}