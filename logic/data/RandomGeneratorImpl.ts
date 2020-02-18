import {RandomGenerator} from "../domain/RandomGenerator";

/**
 * Simple implemetation of genrating random number
 */
export class RandomGeneratorImpl implements RandomGenerator {
    nextRandom(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min) ) + min;
    }

}