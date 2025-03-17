var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Logger } from './Logger.js';
import { PreCiseException } from './PreCiseException.js';
export class FileHelper {
    // Fetch the file and parse an iso utc datetime, otherwise return null.
    static asyncGetUtcDateFromContents(fileNamePath) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger.log(Logger.LogLevel.INFO, FileHelper, FileHelper.asyncGetUtcDateFromContents);
            let parsedDateUtc = null;
            try {
                const fileDescriptor = 'publish details file';
                if (!fileNamePath) {
                    throw new PreCiseException(`file name path to ${fileDescriptor} is null or empty.`);
                }
                const response = yield fetch(fileNamePath);
                if (!response.ok) {
                    throw new PreCiseException(`failed to fetch ${fileDescriptor}.`);
                }
                const fileContents = yield response.text();
                if (!fileContents) {
                    throw new PreCiseException(`file contents of ${fileNamePath} is null or empty.`);
                }
                // Try parsing the date from string contents, if it fails result will remain null.
                const isoUtcString = fileContents.trim();
                parsedDateUtc = new Date(isoUtcString);
                if (isNaN(parsedDateUtc.getTime())) {
                    throw new PreCiseException(`${fileDescriptor} contents contain an invalid ISO UTC datetime. 
                    Example: "2025-03-07T15:00:00+00:00" (YYYY-MM-DDTHH:MM:SS+00:00).`);
                }
            }
            catch (error) {
                parsedDateUtc = null;
                if (error instanceof Error) {
                    Logger.error(Logger.LogLevel.WARN, FileHelper, FileHelper.asyncGetUtcDateFromContents, error);
                }
                else {
                    console.error("Caught Unknown Error", error);
                }
            }
            return parsedDateUtc;
        });
    }
    // Fetch the file and parse list of string names, otherwise return null.
    static asyncGetParticipantsFromContents(fileNamePath) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger.log(Logger.LogLevel.INFO, FileHelper, FileHelper.asyncGetParticipantsFromContents);
            let parsedNames = null;
            try {
                const fileDescriptor = 'participants file';
                if (!fileNamePath) {
                    throw new PreCiseException(`file name path to ${fileDescriptor} is null or empty.`);
                }
                const response = yield fetch(fileNamePath);
                if (!response.ok) {
                    throw new PreCiseException(`failed to fetch ${fileDescriptor}.`);
                }
                const fileContents = yield response.text();
                if (!fileContents) {
                    throw new PreCiseException(`file contents of ${fileNamePath} is null or empty.`);
                }
                // Try parsing strings of non-zero length from each line, removing non-alphabetic characters.
                const fullNameStrings = fileContents
                    .split('\n')
                    .map(line => line
                    .trim() // removes leading/trailing whitespace
                    .replace(/^[^a-zA-Z]+/, '') // remove leading non-letter chars
                    .replace(/[^a-zA-Z\s]+$/, '') // remove trailing non-letter chars
                    .replace(/\s+/g, ' ') // normalize extra spaces
                    .trim())
                    .filter(name => name.length > 0);
                // Remove any duplicated names (case insensitive string comparison).
                parsedNames = Array.from(new Map(fullNameStrings.map(fullName => [fullName.toLowerCase(), fullName])).values());
                if (!parsedNames) {
                    throw new PreCiseException(`${fileDescriptor} contains invalid name(s). 
                    Ensure that each name consists only of alphabetic characters and spaces separated by newline character.`);
                }
            }
            catch (error) {
                parsedNames = null;
                if (error instanceof Error) {
                    Logger.error(Logger.LogLevel.WARN, FileHelper, FileHelper.asyncGetParticipantsFromContents, error);
                }
                else {
                    console.error("Caught Unknown Error", error);
                }
            }
            return parsedNames;
        });
    }
}
