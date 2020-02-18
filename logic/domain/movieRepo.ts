import {Movie} from "../data/movie";

/**
 * Repository of movies
 */
export interface MovieRepo {

    /**
     * Return number of movies in repository
     */
    getMoviesCount(): number;

    /**
     * Add movie to the repository
     * @param movie Movie to be added
     */
    addMovie(movie: Movie): boolean;

    /**
     * Return random movie from repository
     */
    getRandomMovie(): Movie;

    /**
     * Return random movie that has selected duration += 10
     * @param duration Duration of movie we are intesred itn
     */
    getRandomMovieOfDuration(duration: number): Movie;

    /**
     * Return all movies from repository
     */
    getMovies(): Movie[];

    /**
     * Return movies that have at least one genre that covers request.
     * Result are ordered by the most matched movie first.
     * @param genres
     */
    getMoviesWithGenres(genres: string[]): Movie[];

    /**
     * Return movies that have at least one genre that covers request and has selected duration += 10.
     * Result are ordered by the most matched movie first.
     * @param genres
     * @param duration
     */
    getMoviesWithGenresAndDuration(genres: string[], duration: number): Movie[];

}