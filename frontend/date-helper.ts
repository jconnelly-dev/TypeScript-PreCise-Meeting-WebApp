import { Logger } from './logger.js';

export type DayOfWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export const Days: Record<DayOfWeek, DayOfWeek> = {
    Sunday: 'Sunday',
    Monday: 'Monday',
    Tuesday: 'Tuesday',
    Wednesday: 'Wednesday',
    Thursday: 'Thursday',
    Friday: 'Friday',
    Saturday: 'Saturday',
};

export class DateHelper {

    public static DAYS_IN_WEEK: number = 7;
    public static NORMAL_DAYS_IN_YEAR: number = 365;
    public static NORMAL_WEEKS_IN_YEAR: number = 52;
    public static MILLISECONDS_IN_ONE_DAY_IN: number = 1000 * 60 * 60 * 24;

    public static formatDateString(date: Date,
        formatOptions: Intl.DateTimeFormatOptions = { // use default date format "dddd, MMMM dd, yyyy" when one isn't specified
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }): string {
        Logger.log(Logger.LogLevel.TRACE, DateHelper, DateHelper.formatDateString);

        return date.toLocaleDateString('en-US', formatOptions);
    }

    public static getDayOfWeek(date: Date): DayOfWeek {
        Logger.log(Logger.LogLevel.TRACE, DateHelper, DateHelper.getDayOfWeek);

        // Get numeric day of week (i.e. number 0-6).
        const dayIndex = date.getDay();

        // Get typed array of DayOfWeek keys.
        const dayNames = Object.keys(Days) as DayOfWeek[];

        // Return the corresponding DayOfWeek.
        return dayNames[dayIndex];
    }

    public static getDayOfYear(date: Date): number {
        Logger.log(Logger.LogLevel.TRACE, DateHelper, DateHelper.getDayOfYear);

        // Create a date that is January 1st of the same year as the date given.
        const startOfYear = new Date(date.getFullYear(), 0, 0);

        // Find the millisecond difference.
        const diff = date.getTime() - startOfYear.getTime();

        // Calculate the day number of the date.
        const dayOfYear = Math.floor(diff / DateHelper.MILLISECONDS_IN_ONE_DAY_IN);

        return dayOfYear;
    }

    public static getDayOfWeekOfYear(date: Date, targetDay: keyof typeof Days): number {
        Logger.log(Logger.LogLevel.TRACE, DateHelper, DateHelper.getDayOfWeekOfYear);

        // Ensure that the given date is the given target day.
        const targetDayIndex = Object.keys(Days).indexOf(targetDay);
        if (date.getDay() !== targetDayIndex) {
            return 0;
        }

        // Find the number day of year for the given date.
        const dayOfYear: number = DateHelper.getDayOfYear(date);

        // Calculate which number week the DayOfWeek in year.
        //  i.e. what Tuesday does today's date land on? January 21, 2025 is the 3rd Tuesday of the year.
        return Math.floor(dayOfYear / DateHelper.DAYS_IN_WEEK) + 1;
    }

    public static isLeapYear(year: number): boolean {
        Logger.log(Logger.LogLevel.TRACE, DateHelper, DateHelper.isLeapYear);

        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    public static getNumDaysInYear(date: Date): number {
        Logger.log(Logger.LogLevel.TRACE, DateHelper, DateHelper.getNumDaysInYear);

        const year = date.getFullYear();

        let daysInYear: number = DateHelper.NORMAL_DAYS_IN_YEAR;
        if (DateHelper.isLeapYear(year)) {
            daysInYear++;
        }
        return daysInYear;
    }
}