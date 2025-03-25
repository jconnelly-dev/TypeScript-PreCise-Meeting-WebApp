﻿// Ensure this script runs -> after the HTML document is fully parsed, but before the DOM content is fully loaded and displayed.
document.addEventListener('DOMContentLoaded', async () => {

    const userNow: Date = new Date();

    // Set the text content of the <time> element to utcNow converted to the user's timezone.
    const meetingTimeElement: HTMLElement | null = document.getElementById('day-of-meeting');
    if (meetingTimeElement) {
        const formatOptions: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        meetingTimeElement.textContent = userNow.toLocaleDateString('en-US', formatOptions);
    }

    // Remove preload class from body now that DOM has been modified dynamically.
    document.body.classList.remove('preload');
});