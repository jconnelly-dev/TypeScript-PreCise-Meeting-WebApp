import { Logger } from './Logger.js';

export class Randomizer {

    public static getRandomGenerator(seed: number): () => number {
        // Using a linear congruential generator (LCG), which is a common way to generate pseudo-random numbers from a seed.
        const a = 1664525;          // Multiplier
        const c = 1013904223;       // Increment
        const m = Math.pow(2, 32);  // Modulus (2^32)

        // State variable, starting with the seed.
        let state = seed;

        // Return a generator function.
        const generator: () => number = () => {

            // Update state.
            state = (a * state + c) % m;

            // Return the random number as a float between 0 and 1.
            return state / m;
        };

        return generator;
    }

    public static getRandomAssignments(names: string[], rand: () => number): string[] {
        Logger.log(Logger.LogLevel.TEST, Randomizer, Randomizer.getRandomAssignments);

        let assignments: string[] = new Array();

        if (!names) {
            return assignments;
        }

        let picked: string[] = [...names];
        Logger.log(Logger.LogLevel.DEBUG, Randomizer, Randomizer.getRandomAssignments, `before do/while -> picked.length = ${picked.length}`);

        do {
            const inclusiveLower: number = 0;
            const exclusiveUpper: number = picked.length;
            Logger.log(Logger.LogLevel.DEBUG, Randomizer, Randomizer.getRandomAssignments, `inclusiveLower = ${inclusiveLower}`);
            Logger.log(Logger.LogLevel.DEBUG, Randomizer, Randomizer.getRandomAssignments, `exclusiveUpper = ${exclusiveUpper}`);

            const random: number = rand();
            const upNext: number = Math.floor(random * (exclusiveUpper - inclusiveLower)) + inclusiveLower;
            Logger.log(Logger.LogLevel.DEBUG, Randomizer, Randomizer.getRandomAssignments, `random = ${random}`);
            Logger.log(Logger.LogLevel.DEBUG, Randomizer, Randomizer.getRandomAssignments, `upNext = ${upNext}`);
            if (upNext < 0 || upNext >= picked.length) {
                Logger.log(Logger.LogLevel.INFO, Randomizer, Randomizer.getRandomAssignments, `Warning: failed to generate a valid random next person: 
                    inclusiveLower = ${inclusiveLower}, exclusiveUpper = ${exclusiveUpper}, picked.length = ${picked.length}, random = ${upNext}, upNext = ${upNext}`);
            }

            assignments.push(picked[upNext]);
            picked.splice(upNext, 1);
            Logger.log(Logger.LogLevel.DEBUG, Randomizer, Randomizer.getRandomAssignments, `end of do/while -> assignments.length = ${assignments.length}`);
            Logger.log(Logger.LogLevel.DEBUG, Randomizer, Randomizer.getRandomAssignments, `end of do/while -> picked.length = ${picked.length}`);
        } while (picked.length > 0)

        return assignments;
    }

    public static getUniqueFirstPersonGroups(date: Date, names: string[]): string[][] {
        Logger.log(Logger.LogLevel.TEST, Randomizer, Randomizer.getUniqueFirstPersonGroups);

        let groups: string[][] = new Array<string[]>();
        if (!names) {
            return groups;
        }

        // Using the year of the given date so that we get the same random pick behavior foreach unique day of the year.
        const seed: number = date.getFullYear();
        const rand: () => number = this.getRandomGenerator(seed);
        Logger.log(Logger.LogLevel.DEBUG, Randomizer, Randomizer.getUniqueFirstPersonGroups, `seed = ${seed}`);

        let firstPicks: Set<string> = new Set(names);
         
        do {
            const randomAssignments: string[] = this.getRandomAssignments(names, rand);
            Logger.log(Logger.LogLevel.DEBUG, Randomizer, Randomizer.getUniqueFirstPersonGroups, `randomAssignments.length = ${randomAssignments.length}`);

            if (randomAssignments) {
                const randomFirstPerson: string | undefined = randomAssignments?.[0];
                Logger.log(Logger.LogLevel.DEBUG, Randomizer, Randomizer.getUniqueFirstPersonGroups, `randomFirstPerson = ${randomFirstPerson}`);

                if (randomFirstPerson && firstPicks.has(randomFirstPerson)) {
                    Logger.log(Logger.LogLevel.DEBUG, Randomizer, Randomizer.getUniqueFirstPersonGroups, "$$$$$$$$$$ deleting random first person from first picks, and adding random assignments to group!!!");
                    firstPicks.delete(randomFirstPerson);
                    groups.push(randomAssignments);
                }
            }
        } while (firstPicks.size > 0)

        return groups;
    }
}