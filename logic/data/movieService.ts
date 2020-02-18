import {MovieRepoImpl} from "./movieRepoImpl";
import {Movie} from "./movie";

/**
 * Service responsible for finding requested movies
 * @param app
 * @param genres string[] we'are look for movies that have at least one of this genre
 * @param duration we're looking for movies with this duration ( +- 10)
 */
exports.getMovies = (app:any, genres: string[], duration?: number) : Movie[] => {
    const movieRepo: MovieRepoImpl = app.get('movieRepo');
    let movies: Movie[];

    if (genres && genres.length > 0) {
        if (duration == undefined) {
            // If we dont provide duration parameter then we should get all of the movie with specific genres
            movies = movieRepo.getMoviesWithGenres(genres)
        } else {
            // We search for movies with genres and duration
            movies = movieRepo.getMoviesWithGenresAndDuration(genres, duration);
        }
    } else {
        if (duration == undefined) {
            // If we dont provide any parameter, then we should get a single random movie.
            movies = [movieRepo.getRandomMovie()];
        } else {
            // If we dont provide genres parameter then we get a single random movie with a runtime
            // between <duration - 10> and <duration + 10>.
            movies = [movieRepo.getRandomMovieOfDuration(duration)];
        }
    }
    return movies;
};

/**
 * Service responsible for adding new movie
 * @param app
 * @param movie movie to be added (asumed that it is valid)
 */
exports.addMovie = (app:any, movie: Movie) : boolean => {
    const movieRepo: MovieRepoImpl = app.get('movieRepo');

    return movieRepo.addMovie(movie);
};