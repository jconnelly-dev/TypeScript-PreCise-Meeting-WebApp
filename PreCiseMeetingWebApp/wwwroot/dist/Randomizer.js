import { Logger } from './Logger.js';
export class Randomizer {
    static getRandomGenerator(seed) {
        // Using a linear congruential generator (LCG), which is a common way to generate pseudo-random numbers from a seed.
        const a = 1664525; // Multiplier
        const c = 1013904223; // Increment
        const m = Math.pow(2, 32); // Modulus (2^32)
        // State variable, starting with the seed.
        let state = seed;
        // Return a generator function.
        const generator = () => {
            // Update state.
            state = (a * state + c) % m;
            // Return the random number as a float between 0 and 1.
            return state / m;
        };
        return generator;
    }
    static getRandomAssignments(names, rand) {
        Logger.log(Logger.LogLevel.TEST, Randomizer, Randomizer.getRandomAssignments);
        let assignments = new Array();
        if (!names) {
            return assignments;
        }
        let picked = [...names];
        Logger.log(Logger.LogLevel.DEBUG, Randomizer, Randomizer.getRandomAssignments, `before do/while -> picked.length = ${picked.length}`);
        do {
            const inclusiveLower = 0;
            const exclusiveUpper = picked.length;
            Logger.log(Logger.LogLevel.DEBUG, Randomizer, Randomizer.getRandomAssignments, `inclusiveLower = ${inclusiveLower}`);
            Logger.log(Logger.LogLevel.DEBUG, Randomizer, Randomizer.getRandomAssignments, `exclusiveUpper = ${exclusiveUpper}`);
            const random = rand();
            const upNext = Math.floor(random * (exclusiveUpper - inclusiveLower)) + inclusiveLower;
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
        } while (picked.length > 0);
        return assignments;
    }
    static getUniqueFirstPersonGroups(date, names) {
        Logger.log(Logger.LogLevel.TEST, Randomizer, Randomizer.getUniqueFirstPersonGroups);
        let groups = new Array();
        if (!names) {
            return groups;
        }
        // Using the year of the given date so that we get the same random pick behavior foreach unique day of the year.
        const seed = date.getFullYear();
        const rand = this.getRandomGenerator(seed);
        Logger.log(Logger.LogLevel.DEBUG, Randomizer, Randomizer.getUniqueFirstPersonGroups, `seed = ${seed}`);
        let firstPicks = new Set(names);
        do {
            const randomAssignments = this.getRandomAssignments(names, rand);
            Logger.log(Logger.LogLevel.DEBUG, Randomizer, Randomizer.getUniqueFirstPersonGroups, `randomAssignments.length = ${randomAssignments.length}`);
            if (randomAssignments) {
                const randomFirstPerson = randomAssignments === null || randomAssignments === void 0 ? void 0 : randomAssignments[0];
                Logger.log(Logger.LogLevel.DEBUG, Randomizer, Randomizer.getUniqueFirstPersonGroups, `randomFirstPerson = ${randomFirstPerson}`);
                if (randomFirstPerson && firstPicks.has(randomFirstPerson)) {
                    Logger.log(Logger.LogLevel.DEBUG, Randomizer, Randomizer.getUniqueFirstPersonGroups, "$$$$$$$$$$ deleting random first person from first picks, and adding random assignments to group!!!");
                    firstPicks.delete(randomFirstPerson);
                    groups.push(randomAssignments);
                }
            }
        } while (firstPicks.size > 0);
        return groups;
    }
}
