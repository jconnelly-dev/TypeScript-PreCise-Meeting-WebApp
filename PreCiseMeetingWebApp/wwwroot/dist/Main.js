var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DateHelper } from './DateHelper.js';
import { FileHelper } from './FileHelper.js';
import { Logger } from './Logger.js';
import { Meetings } from './Meetings.js';
// Ensure this script runs -> after the HTML document is fully parsed, but before the DOM content is fully loaded and displayed.
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    Logger.log(Logger.LogLevel.PROD, "DOM", addEventListener);
    const userNow = new Date();
    // Set the text content of the <time> element to utcNow converted to the user's timezone.
    const meetingTimeElement = document.getElementById('day-of-meeting');
    if (meetingTimeElement) {
        meetingTimeElement.textContent = DateHelper.formatDateString(userNow);
    }
    // Set the text content of the <time> element to the utc datetime found in 'BUILD-FILE-NAME' converted to the user's timezone.
    const publishTimeElement = document.getElementById('last-publish-datetime');
    if (publishTimeElement) {
        const FILE_BUILD_DETAILS = '/files/build.txt';
        const publishDate = yield FileHelper.asyncGetUtcDateFromContents(FILE_BUILD_DETAILS);
        publishTimeElement.textContent = (publishDate) ? DateHelper.formatDateString(publishDate) : "Invalid date";
    }
    // Dynamically create <li> items in the <ul> element based off the names parsed from 'names.txt' file.
    const listSectionElement = document.getElementById('participants-list');
    const listElement = listSectionElement === null || listSectionElement === void 0 ? void 0 : listSectionElement.querySelector('ul');
    if (listSectionElement && listElement) {
        listElement.innerHTML = ''; // clear existing list items
        const FILE_MEETING_NAMES = '/files/names.txt';
        const names = yield FileHelper.asyncGetParticipantsFromContents(FILE_MEETING_NAMES);
        if (names && names.length > 0) {
            const meetingNames = Meetings.getMeetingForWeek(userNow, names);
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
                const buttonElement = document.getElementById('copy-button');
                Logger.log(Logger.LogLevel.PROD, "DOM", addEventListener, "after getting buttonElement...");
                if (buttonElement) {
                    Logger.log(Logger.LogLevel.PROD, "DOM", addEventListener, "buttonElement found!");
                    buttonElement.addEventListener('click', copyElementChangeState); // Add event listener here
                }
            }
        }
    }
}));
function copyElementChangeState() {
    const attendees = extractParticipants();
    const meetingDate = extractMeetingDate();
    let iconElement = document.getElementById('copy-icon');
    if (attendees && meetingDate && iconElement) {
        iconElement.classList.remove('fa-copy');
        insertNamesIntoClipboard(meetingDate, attendees);
        iconElement.classList.add('fa-check');
    }
}
function extractParticipants() {
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
function extractMeetingDate() {
    var _a;
    let extractedDate = null;
    const dateElement = document.getElementById('day-of-meeting');
    if (dateElement) {
        const dateString = (_a = dateElement.textContent) === null || _a === void 0 ? void 0 : _a.trim();
        if (dateString) {
            extractedDate = new Date(dateString);
        }
    }
    return extractedDate;
}
function insertNamesIntoClipboard(date, attendees) {
    let copiedText = "--- START MEETING ---";
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
