import { Logger } from './logger.js';

export class Clipboard {

    public static copyElementChangeState(): void {
        Logger.log(Logger.LogLevel.INFO, Clipboard, Clipboard.copyElementChangeState);

        const attendees: string[] = Clipboard.extractParticipants();
        const meetingDate: string = Clipboard.extractMeetingDateString();
        if (attendees && meetingDate) {
            const iconElement: HTMLElement | null = document.getElementById('copy-icon');
            const textElement: HTMLElement | null = document.querySelector('.share-info');
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
                    textElement.textContent = originalText ?? 'Copy';
                    iconElement.blur(); // remove :focus css pseudo-class
                }, 2500);
            }
        }
    }

    public static extractParticipants(): string[] {
        Logger.log(Logger.LogLevel.TRACE, Clipboard, Clipboard.extractParticipants);

        let extractedNames: string[] = [];

        const listSectionElement: HTMLElement | null = document.getElementById('participants-list');
        if (listSectionElement) {
            const participantItems = listSectionElement.querySelectorAll('li');
            if (participantItems) {
                participantItems.forEach((item) => {
                    // Remove the number and any leading whitespace.
                    const name: string | undefined = item.textContent?.replace(/^\d+\s*/, '').trim();
                    if (name) {
                        extractedNames.push(name);
                    }
                });
            }
        }

        return extractedNames;
    }

    public static extractMeetingDateString(): string {
        Logger.log(Logger.LogLevel.TRACE, Clipboard, Clipboard.extractMeetingDateString);

        let extractedDate: string = "";

        const dateElement: HTMLElement | null = document.getElementById('day-of-meeting');
        if (dateElement) {
            const localDateString: string | undefined = dateElement.textContent?.trim();
            if (localDateString) {
                extractedDate = localDateString;
            }
        }

        return extractedDate;
    }

    public static insertNamesIntoClipboard(localDateString: string, attendees: string[]): void {
        Logger.log(Logger.LogLevel.TRACE, Clipboard, Clipboard.insertNamesIntoClipboard);

        if (localDateString) {
            const newLine = (typeof window === "undefined") ? "\r\n" : "\n"; // for Node.js vs browser
            let copiedText: string = "--- START MEETING ---";
            copiedText += `${newLine}--- ${localDateString} ---`;
            if (attendees) {
                attendees.forEach((attendee, arrayIdx) => {
                    const displayIdx: number = arrayIdx + 1;
                    copiedText += `${newLine}[${displayIdx}] ${attendee}`;
                });
            }
            navigator.clipboard.writeText(copiedText);
        }
    }
}