import { Logger } from './Logger.js';
export class Clipboard {
    static copyElementChangeState() {
        Logger.log(Logger.LogLevel.INFO, Clipboard, Clipboard.copyElementChangeState);
        const attendees = Clipboard.extractParticipants();
        const meetingDate = Clipboard.extractMeetingDateString();
        if (attendees && meetingDate) {
            const iconElement = document.getElementById('copy-icon');
            const textElement = document.querySelector('.share-info');
            if (iconElement && textElement) {
                Clipboard.insertNamesIntoClipboard(meetingDate, attendees);
                // Change icon to checked.
                const originalText = textElement.textContent;
                textElement.textContent = 'Copied!';
                iconElement.classList.remove('fa-copy');
                iconElement.classList.add('fa-check');
                // Reset icon to copy after 2.5 seconds.
                setTimeout(() => {
                    iconElement.classList.remove('fa-check');
                    iconElement.classList.add('fa-copy');
                    textElement.textContent = originalText !== null && originalText !== void 0 ? originalText : 'Copy';
                    iconElement.blur(); // remove :focus css pseudo-class
                }, 2500);
            }
        }
    }
    static extractParticipants() {
        Logger.log(Logger.LogLevel.TRACE, Clipboard, Clipboard.extractParticipants);
        let extractedNames = [];
        const listSectionElement = document.getElementById('participants-list');
        if (listSectionElement) {
            const participantItems = listSectionElement.querySelectorAll('li');
            if (participantItems) {
                participantItems.forEach((item) => {
                    var _a;
                    // Remove the number and any leading whitespace.
                    const name = (_a = item.textContent) === null || _a === void 0 ? void 0 : _a.replace(/^\d+\s*/, '').trim();
                    if (name) {
                        extractedNames.push(name);
                    }
                });
            }
        }
        return extractedNames;
    }
    static extractMeetingDateString() {
        var _a;
        Logger.log(Logger.LogLevel.TRACE, Clipboard, Clipboard.extractMeetingDateString);
        let extractedDate = "";
        const dateElement = document.getElementById('day-of-meeting');
        if (dateElement) {
            const localDateString = (_a = dateElement.textContent) === null || _a === void 0 ? void 0 : _a.trim();
            if (localDateString) {
                extractedDate = localDateString;
            }
        }
        return extractedDate;
    }
    static insertNamesIntoClipboard(localDateString, attendees) {
        Logger.log(Logger.LogLevel.TRACE, Clipboard, Clipboard.insertNamesIntoClipboard);
        if (localDateString) {
            const newLine = (typeof window === "undefined") ? "\r\n" : "\n"; // for Node.js vs browser
            let copiedText = "--- START MEETING ---";
            copiedText += `${newLine}--- ${localDateString} ---`;
            if (attendees) {
                attendees.forEach((attendee, arrayIdx) => {
                    const displayIdx = arrayIdx + 1;
                    copiedText += `${newLine}[${displayIdx}] ${attendee}`;
                });
            }
            navigator.clipboard.writeText(copiedText);
        }
    }
}
