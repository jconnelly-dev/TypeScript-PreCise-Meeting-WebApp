import { Logger } from './Logger.js';
export const Days = {
    Sunday: 'Sunday',
    Monday: 'Monday',
    Tuesday: 'Tuesday',
    Wednesday: 'Wednesday',
    Thursday: 'Thursday',
    Friday: 'Friday',
    Saturday: 'Saturday',
};
export class DateHelper {
    static formatDateString(date, formatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) {
        Logger.log(Logger.LogLevel.TRACE, DateHelper, DateHelper.formatDateString);
        return date.toLocaleDateString('en-US', formatOptions);
    }
    static getDayOfWeek(date) {
        Logger.log(Logger.LogLevel.TRACE, DateHelper, DateHelper.getDayOfWeek);
        // Get numeric day of week (i.e. number 0-6).
        const dayIndex = date.getDay();
        // Get typed array of DayOfWeek keys.
        const dayNames = Object.keys(Days);
        // Return the corresponding DayOfWeek.
        return dayNames[dayIndex];
    }
    static getDayOfYear(date) {
        Logger.log(Logger.LogLevel.TRACE, DateHelper, DateHelper.getDayOfYear);
        // Create a date that is January 1st of the same year as the date given.
        const startOfYear = new Date(date.getFullYear(), 0, 0);
        // Find the millisecond difference.
        const diff = date.getTime() - startOfYear.getTime();
        // Calculate the day number of the date.
        const dayOfYear = Math.floor(diff / DateHelper.MILLISECONDS_IN_ONE_DAY_IN);
        return dayOfYear;
    }
    static getDayOfWeekOfYear(date, targetDay) {
        Logger.log(Logger.LogLevel.TRACE, DateHelper, DateHelper.getDayOfWeekOfYear);
        // Ensure that the given date is the given target day.
        const targetDayIndex = Object.keys(Days).indexOf(targetDay);
        if (date.getDay() !== targetDayIndex) {
            return 0;
        }
        // Find the number day of year for the given date.
        const dayOfYear = DateHelper.getDayOfYear(date);
        // Calculate which number week the DayOfWeek in year.
        //  i.e. what Tuesday does today's date land on? January 21, 2025 is the 3rd Tuesday of the year.
        return Math.floor(dayOfYear / DateHelper.DAYS_IN_WEEK) + 1;
    }
    static isLeapYear(year) {
        Logger.log(Logger.LogLevel.TRACE, DateHelper, DateHelper.isLeapYear);
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }
    static getNumDaysInYear(date) {
        Logger.log(Logger.LogLevel.TRACE, DateHelper, DateHelper.getNumDaysInYear);
        const year = date.getFullYear();
        let daysInYear = DateHelper.NORMAL_DAYS_IN_YEAR;
        if (DateHelper.isLeapYear(year)) {
            daysInYear++;
        }
        return daysInYear;
    }
}
DateHelper.DAYS_IN_WEEK = 7;
DateHelper.NORMAL_DAYS_IN_YEAR = 365;
DateHelper.NORMAL_WEEKS_IN_YEAR = 52;
DateHelper.MILLISECONDS_IN_ONE_DAY_IN = 1000 * 60 * 60 * 24;
