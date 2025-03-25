export class PreCiseException extends Error {

    constructor(message: string) {
        super(message);
        this.name = "PreCiseException";
    }
}