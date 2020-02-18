import {Movie} from './movie';
import {MovieDao} from '../domain/movieDao';
import {MovieRepo} from '../domain/movieRepo';
import {RandomGenerator} from '../domain/RandomGenerator';

const intersect = require('intersect');

export class MovieRepoImpl implements MovieRepo {

    constructor(private movieDao: MovieDao, private randomGenerator: RandomGenerator) {}

    /**
     * Return number of movies in repository
     */
    getMoviesCount(): number {
        return this.movieDao.movies.length;
    }

    /**
     * Add movie to the repository
     * @param movie Movie to be added
     */
    addMovie(movie: Movie): boolean {
        movie.id = this.getMaxId() + 1;
        this.movieDao.movies.push(movie);
        // Save to file
        const isSaved: boolean = this.movieDao.save();
        if (!isSaved) {
            // If it fails undo the operation
            this.movieDao.movies.pop();
        }
        return isSaved;
    }

    /**
     * Return random movie from repository
     */
    getRandomMovie(): Movie {
        const index = this.randomGenerator.nextRandom(0, this.getMoviesCount());
        return this.getMovies()[index];
    }

    /**
     * Return random movie that has selected duration += 10
     * @param duration Duration of movie we are intesred itn
     */
    getRandomMovieOfDuration(duration: number): Movie {
        const movies = this.filterMovieByDuration(this.getMovies(), duration);
        const index = this.randomGenerator.nextRandom(0, movies.length);
        return movies[index];
    }

    /**
     * Return all movies from repository
     */
    getMovies(): Movie[] {
        return this.movieDao.movies;
    }

    /**
     * Return movies that have at least one genre that covers request.
     * Result are ordered by the most matched movie first.
     * @param genres
     */
    getMoviesWithGenres(genres: string[]): Movie[] {
        return this.getMovies().filter((movie => {
                // return movie with genres that includes at least one genre from genres parameter
                return movie.genres.some((genre) => {
                    return genres.includes(genre);
                });
            }))
            .sort((first, second) => {
                // sort by number of covered genres
                return intersect(genres, second.genres).length - intersect(genres, first.genres).length;
            });
    }

    /**
     * Return movies that have at least one genre that covers request and has selected duration += 10.
     * Result are ordered by the most matched movie first.
     * @param genres
     * @param duration
     */
    getMoviesWithGenresAndDuration(genres: string[], duration: number): Movie[] {
        const moviesWithGenres = this.getMoviesWithGenres(genres);
        return this.filterMovieByDuration(moviesWithGenres, duration);
    }

    private filterMovieByDuration(movies: Movie[], duration: number): Movie[] {
        return movies.filter((movie => {
            return movie.runtime >= duration - 10 && movie.runtime <= duration + 10;
        }));
    }

    private getMaxId(): number {
        return this.getMovies().reduce((max, movie) => {
            return movie.id > max ? movie.id : max;
        }, 0);
    }
}