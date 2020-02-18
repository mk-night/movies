export class Movie {

    id: number = 0;

    constructor(
        public title: string,
        public year: number,
        public runtime: number,
        public genres: string[],
        public director: string,
        public actors?: string,
        public plot?: string,
        public posterUrl?: string,
        ) {
    }
}