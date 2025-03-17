import { DateHelper } from './DateHelper.js';
import { FileHelper } from './FileHelper.js';
import { Logger } from './Logger.js';
import { Meetings } from './Meetings.js';

// Ensure this script runs -> after the HTML document is fully parsed, but before the DOM content is fully loaded and displayed.
document.addEventListener('DOMContentLoaded', async () => {
    Logger.log(Logger.LogLevel.PROD, "DOM", addEventListener);

    const userNow: Date = new Date();

    // Set the text content of the <time> element to utcNow converted to the user's timezone.
    const meetingTimeElement: HTMLElement | null = document.getElementById('day-of-meeting');
    if (meetingTimeElement) {
        meetingTimeElement.textContent = DateHelper.formatDateString(userNow);
    }

    // Set the text content of the <time> element to the utc datetime found in 'BUILD-FILE-NAME' converted to the user's timezone.
    const publishTimeElement: HTMLElement | null = document.getElementById('last-publish-datetime');
    if (publishTimeElement) {
        const FILE_BUILD_DETAILS: string = '/files/build.txt';
        const publishDate: Date | null = await FileHelper.asyncGetUtcDateFromContents(FILE_BUILD_DETAILS);
        publishTimeElement.textContent = (publishDate) ? DateHelper.formatDateString(publishDate) : "Invalid date";
    }

    // Dynamically create <li> items in the <ul> element based off the names parsed from 'names.txt' file.
    const listSectionElement: HTMLElement | null = document.getElementById('participants-list');
    const listElement = listSectionElement?.querySelector('ul');
    if (listSectionElement && listElement) {
        listElement.innerHTML = ''; // clear existing list items
        const FILE_MEETING_NAMES: string = '/files/names.txt';
        const names: string[] | null = await FileHelper.asyncGetParticipantsFromContents(FILE_MEETING_NAMES);
        if (names && names.length > 0) {
            const meetingNames: string[] = Meetings.getMeetingForWeek(userNow, names);
            if (meetingNames) {
                meetingNames.forEach((name, index) => {
                    const itemElement = document.createElement('li');
                    const span = document.createElement('span');
                    span.textContent = `${index + 1}`; // +1 cuz numbered list displayed has base index=1 vs array base index=0
                    itemElement.appendChild(span);
                    itemElement.append(` ${name}`);
                    listElement.appendChild(itemElement);
                });

                // Adding an event listener for the button, now that the DOM has been fully loaded.
                Logger.log(Logger.LogLevel.PROD, "DOM", addEventListener, "before getting buttonElement...");
                const buttonElement: HTMLButtonElement | null = document.getElementById('copy-button') as HTMLButtonElement;
                Logger.log(Logger.LogLevel.PROD, "DOM", addEventListener, "after getting buttonElement...");
                if (buttonElement) {
                    Logger.log(Logger.LogLevel.PROD, "DOM", addEventListener, "buttonElement found!");
                    buttonElement.addEventListener('click', copyElementChangeState);  // Add event listener here
                }
            }
        }
    }
});

function copyElementChangeState(): void {
    const attendees: string[] = extractParticipants();
    const meetingDate: Date | null = extractMeetingDate();
    let iconElement: HTMLElement | null = document.getElementById('copy-icon');
    if (attendees && meetingDate && iconElement) {
        iconElement.classList.remove('fa-copy');
        insertNamesIntoClipboard(meetingDate, attendees);
        iconElement.classList.add('fa-check');
    }
}

function extractParticipants(): string[] {
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

function extractMeetingDate(): Date | null {
    let extractedDate: Date | null = null;
    const dateElement: HTMLElement | null = document.getElementById('day-of-meeting');
    if (dateElement) {
        const dateString = dateElement.textContent?.trim();
        if (dateString) {
            extractedDate = new Date(dateString);
        }
    }
    return extractedDate;
}

function insertNamesIntoClipboard(date: Date, attendees: string[]): void {
    let copiedText: string = "--- START MEETING ---";
    if (date) {
        const newLine = (typeof window === "undefined") ? "\r\n" : "\n"; // for Node.js vs browser
        copiedText += `${newLine}--- ${date} ---`;
        if (attendees) {
            attendees.forEach((attendee, idx) => {
                copiedText += `${newLine}[${idx}] ${attendee}`;
            });
        }
        navigator.clipboard.writeText(copiedText);
    }
}
