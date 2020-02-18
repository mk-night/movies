import {Movie} from '../data/movie';

/**
 * Defines DAO for movies
 */
export abstract class MovieDao {
    protected constructor(
        readonly genres: string[],
        readonly movies: Movie[]
    ) {}

    /**
     * Save data to persistent storage
     */
    abstract save() : boolean;
}