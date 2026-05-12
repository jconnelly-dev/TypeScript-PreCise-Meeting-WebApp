import { Logger } from './logger.js';

export class Clipboard {

    public static copyElementChangeState(): void {
        Logger.log(Logger.LogLevel.INFO, Clipboard, Clipboard.copyElementChangeState);

        const attendees: Array<{ badge: string, name: string }> = Clipboard.extractParticipants();
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

    public static extractParticipants(): Array<{ badge: string, name: string }> {
        Logger.log(Logger.LogLevel.TRACE, Clipboard, Clipboard.extractParticipants);

        let extractedParticipants: Array<{ badge: string, name: string }> = [];

        const listSectionElement: HTMLElement | null = document.getElementById('participants-list');
        if (listSectionElement) {
            const participantItems = listSectionElement.querySelectorAll('li');
            if (participantItems) {
                participantItems.forEach((item) => {
                    const badgeElement: HTMLElement | null = item.querySelector('.meeting-participant-number');
                    const nameElement: HTMLElement | null = item.querySelector('.meeting-participant-name');
                    const badgeText: string | undefined = badgeElement?.textContent?.trim();
                    const name: string | undefined = nameElement?.textContent?.trim();
                    if (badgeText && name) {
                        extractedParticipants.push({
                            badge: badgeElement?.classList.contains('is-crossed-out') ? 'x' : badgeText,
                            name,
                        });
                    }
                });
            }
        }

        return extractedParticipants;
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

    public static insertNamesIntoClipboard(localDateString: string, attendees: Array<{ badge: string, name: string }>): void {
        Logger.log(Logger.LogLevel.TRACE, Clipboard, Clipboard.insertNamesIntoClipboard);

        if (localDateString) {
            const newLine = (typeof window === "undefined") ? "\r\n" : "\n"; // for Node.js vs browser
            let copiedText: string = "--- START MEETING ---";
            copiedText += `${newLine}--- ${localDateString} ---`;
            if (attendees) {
                attendees.forEach((attendee) => {
                    copiedText += `${newLine}[${attendee.badge}] ${attendee.name}`;
                });
            }
            navigator.clipboard.writeText(copiedText);
        }
    }
}