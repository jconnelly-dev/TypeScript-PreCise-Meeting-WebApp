export class PreCiseException extends Error {
    constructor(message) {
        super(message);
        this.name = "PreCiseException";
    }
}
