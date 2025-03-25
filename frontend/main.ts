import { Clipboard } from './clipboard.js';
import { DateHelper } from './date-helper.js';
import { FileHelper } from './file-helper.js';
import { Logger } from './logger.js';
import { Meetings } from './meetings.js';

// Ensure this script runs -> after the HTML document is fully parsed, but before the DOM content is fully loaded and displayed.
document.addEventListener('DOMContentLoaded', async () => {
    Logger.log(Logger.LogLevel.INFO, "DOM", addEventListener);

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
                const buttonElement: HTMLButtonElement | null = document.getElementById('copy-button') as HTMLButtonElement;
                if (buttonElement) {
                    buttonElement.addEventListener('click', Clipboard.copyElementChangeState);
                }
            }
        }
    }

    // Remove preload class from body now that DOM has been modified dynamically.
    document.body.classList.remove('preload');
});