/**
 * Generator of random numbers. We use it to select a random movie from the movie repo
 */
export interface RandomGenerator {
    nextRandom(min: number, max: number): number;
}