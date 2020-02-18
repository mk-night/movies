import {Movie} from "../logic/data/movie";
import {MovieRepoImpl} from "../logic/data/movieRepoImpl";
import {MovieDaoImpl} from "../logic/data/MovieDaoImpl";

import {RandomGeneratorImpl} from "../logic/data/__mock__/RandomGeneratorImpl";
import {MovieDao} from "../logic/domain/movieDao";
import {RandomGenerator} from "../logic/domain/RandomGenerator";
import * as fs from "fs";


const path = require('path');

describe('MovieRepo', () => {

    let movieDao : MovieDao;
    let randomGenerator: RandomGenerator;
    let movieRepo: MovieRepoImpl;

    let testDb: string;


    beforeEach(() => {
        // Reset modules to have new object in every test
        jest.resetModules();
        // Test database
        const originalDb  = './data/testdb.json';
        // We manipulates data sometimes - so we create copy of it in each test
        testDb = `./data/testdb_${Date.now()}_${Math.floor(100 + Math.random() * 900)}.json`;
        fs.copyFileSync(path.resolve(originalDb), path.resolve(testDb));
        movieDao = new MovieDaoImpl(path.resolve(testDb));
        // RandomGenerator comes from mock - so we know the sequence of generates values
        randomGenerator = new RandomGeneratorImpl();
        // Create object that we test
        movieRepo = new MovieRepoImpl(movieDao, randomGenerator);
    });

    afterEach(() => {
        // Remove database that was used during the test
        fs.unlinkSync(path.resolve(testDb));
    });

    it('adds movie', () => {
        // arrange
        const initialMovieCount = movieRepo.getMoviesCount();
        const movieToAdd = new Movie("Title", 2020, 111, ['Genre 1'], 'Director');

        // act
        movieRepo.addMovie(movieToAdd);
        const movies = movieRepo.getMovies();
        const lastMovie = movies[movies.length - 1];

        // assert
        expect(movieRepo.getMoviesCount()).toBe(initialMovieCount + 1);
        expect(lastMovie).toBe(movieToAdd);
    });

    it('returns random movie', () => {
        // arrange

        // act
        const movie1 = movieRepo.getRandomMovie();
        const movie2 = movieRepo.getRandomMovie();
        const movie3 = movieRepo.getRandomMovie();

        // assert
        expect(movie1.id).toBe(1);
        expect(movie2.id).toBe(2);
        expect(movie3.id).toBe(3);
    });

    it('returns random movie of selected duration', () => {
        // arrange
        const duration1 = 100;
        const duration2 = 120;
        const duration3 = 140;

        // act
        // We have 2 movies with duration aroung 100 - so we check if it returns randomly one of them
        const movie1a = movieRepo.getRandomMovieOfDuration(duration1);
        const movie1b = movieRepo.getRandomMovieOfDuration(duration1);
        const movie2 = movieRepo.getRandomMovieOfDuration(duration2);
        const movie3 = movieRepo.getRandomMovieOfDuration(duration3);

        // assert
        expect(movie1a.id).toBe(1);
        expect(movie1b.id).toBe(4);
        expect(movie2.id).toBe(2);
        expect(movie3.id).toBe(3);
    });

    it('returns nothing if we dont have movie with selected duration', () => {
        // arrange
        const duration1 = 10;
        const duration2 = 81;
        const duration3 = 200;

        // act
        const movie1 = movieRepo.getRandomMovieOfDuration(duration1);
        const movie2 = movieRepo.getRandomMovieOfDuration(duration2);
        const movie3 = movieRepo.getRandomMovieOfDuration(duration3);

        // assert
        expect(movie1).toBeUndefined();
        expect(movie2).toBeUndefined();
        expect(movie3).toBeUndefined();
    });

    it('returns movies with at least one of specifed genre', () => {
        // arrange
        const genres1 = ['Genre 1', 'Genre 3'];
        const genres2 = ['Genre 2', 'Genre 3'];
        const genres3 = ['Genre 10'];

        // act
        const movies1 = movieRepo.getMoviesWithGenres(genres1);
        const movies2 = movieRepo.getMoviesWithGenres(genres2);
        const movies3 = movieRepo.getMoviesWithGenres(genres3);

        // assert
        expect(movies1.length).toBe(4);
        expect(movies1[0].id).toBe(4);
        expect(movies2.length).toBe(4);
        expect(movies2[0].id).toBe(2);
        expect(movies3.length).toBe(1);
        expect(movies3[0].id).toBe(1);
    });

    it('returns nothing if there is no movie with specified genres', () => {
        // arrange
        const genres1 = ['Genre 100', 'Genre 300'];
        const genres2 = ['Genre 123'];

        // act
        const movies1 = movieRepo.getMoviesWithGenres(genres1);
        const movies2 = movieRepo.getMoviesWithGenres(genres2);

        // assert
        expect(movies1).toEqual([]);
        expect(movies2).toEqual([]);
    });

    it('returns movies with genre and duration', () => {
        // arrange
        const genres1 = ['Genre 1', 'Genre 3'];
        const duration1 = 100;
        const genres2 = ['Genre 2'];
        const duration2 = 130;

        // act
        const movies1 = movieRepo.getMoviesWithGenresAndDuration(genres1, duration1);
        const movies2 = movieRepo.getMoviesWithGenresAndDuration(genres2, duration2);

        // assert
        expect(movies1.length).toBe(2);
        expect(movies1[0].id).toBe(4);
        expect(movies2.length).toBe(1);
        expect(movies2[0].id).toBe(2);
    });

    it('returns nothing if genre and duration dont match', () => {
        // arrange
        const genres = ['Genre 999'];
        const duration = 999;

        // act
        const movies = movieRepo.getMoviesWithGenresAndDuration(genres, duration);

        // assert
        expect(movies).toEqual([]);
    });

});