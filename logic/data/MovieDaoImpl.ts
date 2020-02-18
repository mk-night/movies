import {MovieDao} from "../domain/movieDao";

const fs = require('fs');

export class MovieDaoImpl extends MovieDao {

    private readonly filename: string;

    /**
     * Load data from JSON file
     * @param filename path of filename
     */
    constructor(filename: string) {
        // without database the app is useless - so we setup id synchronously
        if (fs.existsSync(filename)) {
            try {
                const data = require(filename);
                // Just make sure, that we have arrays.
                // For simpliciy I assume that data.movies collection consist of valid Movie objects
                super(data.genres || [], data.movies || []);
                this.filename = filename;
            }
            catch (err) {
                super([], []);
                this.filename = filename;
            }
        } else {
            super([], []);
            this.filename = filename;
        }
    }

    /**
     * Saves database to JSON file
     */
    save(): boolean {
        try {
            fs.accessSync(this.filename, fs.constants.W_OK & fs.constants.F_OK);
            const fileContent = JSON.stringify({genres: this.genres, movies: this.movies});
            fs.writeFileSync(this.filename, fileContent);
            return true;
        } catch (err) {
            return false;
        }
    }

}