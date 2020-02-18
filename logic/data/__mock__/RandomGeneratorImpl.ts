import {RandomGenerator} from "../../domain/RandomGenerator";


/**
 * Mock implemetation of RandomGeneratorImpl
 * Instead of random values it return sequence from min to max
 */
export class RandomGeneratorImpl implements RandomGenerator {

    private lastValue: number;

    constructor() {
        this.lastValue = 0;
    }

    nextRandom(min: number, max: number): number {
        const returnValue = this.lastValue;
        this.lastValue = (this.lastValue + 1) % (max - min);
        return returnValue;
    }

}