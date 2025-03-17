import { DateHelper } from './DateHelper.js';
import { DayOfWeek } from './DateHelper.js';
import { Logger } from './Logger.js';
import { PreCiseException } from './PreCiseException.js';
import { Randomizer } from './Randomizer.js';

export interface Meeting {
    id: number;
    date: Date;
    dayOfWeek: DayOfWeek;
    attendees: string[];
}

export class Meetings {

    public static getWeeklyMeetingsInYear(date: Date, names: string[]): Meeting[] {
        Logger.log(Logger.LogLevel.INFO, Meetings, Meetings.getWeeklyMeetingsInYear);

        const meetings: Meeting[] = new Array<Meeting>();
        if (!names) {
            return meetings;
        }

        // Adjust January 1st of the given year to the day of week as the weekly meetings, this marks the 1st meeting of the year.
        const meetingDayOfWeek: DayOfWeek = DateHelper.getDayOfWeek(date);
        const firstMeetingOfYear = new Date(date.getFullYear(), 0, 1);
        while (DateHelper.getDayOfWeek(firstMeetingOfYear) != meetingDayOfWeek) {
            firstMeetingOfYear.setDate(firstMeetingOfYear.getDate() + 1);
        }
        Logger.log(Logger.LogLevel.DEBUG, Meetings, Meetings.getWeeklyMeetingsInYear, `firstMeetingOfYear = ${firstMeetingOfYear}`);

        // Create a meeting (w/empty attendees for now) foreach possible weekly meeting that can occur in the given year.
        // - assuming 1 meeting a week, meetings occur on the same day each week, use dayOfWeek of the 1st meeting of the year to start
        const year: number = date.getFullYear();
        const dayInYear: number = date.getDate();
        const totalDaysInYear: number = DateHelper.getNumDaysInYear(date);
        const daysRemainingInYear = totalDaysInYear - DateHelper.getDayOfYear(firstMeetingOfYear);
        Logger.log(Logger.LogLevel.DEBUG, Meetings, Meetings.getWeeklyMeetingsInYear, `totalDaysInYear = ${totalDaysInYear}`);
        Logger.log(Logger.LogLevel.DEBUG, Meetings, Meetings.getWeeklyMeetingsInYear, `daysRemainingForMeetings = ${daysRemainingInYear}`);

        for (let day: number = 1; day <= daysRemainingInYear; day++) {
            const nextDate: Date = new Date(year, 0, dayInYear + day);
            const nextDayOfWeek = DateHelper.getDayOfWeek(nextDate);
            if (nextDayOfWeek == meetingDayOfWeek) {
                meetings.push({
                    id: meetings.length + 1, // using 1-based indexing for meetingId
                    date: nextDate,
                    dayOfWeek: nextDayOfWeek,
                    attendees: []
                });
            }
        }

        // Find the max number of times a person can be picked 1st in the given year.
        const totalMeetingsInYear = meetings.length;
        const numFirstPersonMeetingsInYear: number = (totalMeetingsInYear % names.length == 0) ? totalMeetingsInYear / names.length : (totalMeetingsInYear / names.length) + 1;
        Logger.log(Logger.LogLevel.DEBUG, Meetings, Meetings.getWeeklyMeetingsInYear, `totalMeetingsInYear = ${totalMeetingsInYear}`);
        Logger.log(Logger.LogLevel.DEBUG, Meetings, Meetings.getWeeklyMeetingsInYear, `numFirstPersonMeetingsInYear = ${numFirstPersonMeetingsInYear}`);

        // Generate the meetings w/random picks for the given year, only repeating the first person after all people have gone first.
        let currMeetingIdx = 0;
        do {
            Logger.log(Logger.LogLevel.DEBUG, Meetings, Meetings.getWeeklyMeetingsInYear, `start do/while -> currMeetingIdx = ${currMeetingIdx}`);
            const groupedMeetings: string[][] = Randomizer.getUniqueFirstPersonGroups(firstMeetingOfYear, names);
            if (groupedMeetings) {
                for (let groupMeetingIdx: number = 0; groupMeetingIdx < groupedMeetings.length && currMeetingIdx < meetings.length; groupMeetingIdx++) {
                    meetings[currMeetingIdx].attendees = groupedMeetings[groupMeetingIdx];
                    currMeetingIdx++
                }
            }
            Logger.log(Logger.LogLevel.DEBUG, Meetings, Meetings.getWeeklyMeetingsInYear, `end do/while -> currMeetingIdx = ${currMeetingIdx}`);
        } while (currMeetingIdx < meetings.length)

        return meetings;
    }

    public static getMeetingForWeek(date: Date, names: string[]): string[] {
        Logger.log(Logger.LogLevel.INFO, Meetings, Meetings.getMeetingForWeek);

        let randomizedNames: string[] = new Array<string>();

        try {
            if (!names) {
                throw new PreCiseException("names given for weekly meeting is null or empty.");
            }

            const meetingDayOfWeek: DayOfWeek = DateHelper.getDayOfWeek(date);
            const weekNumberInYear: number = DateHelper.getDayOfWeekOfYear(date, meetingDayOfWeek); // 1-based number
            Logger.log(Logger.LogLevel.DEBUG, Meetings, Meetings.getWeeklyMeetingsInYear, `meetingDayOfWeek = ${meetingDayOfWeek}`);
            Logger.log(Logger.LogLevel.DEBUG, Meetings, Meetings.getWeeklyMeetingsInYear, `weekNumberInYear = ${weekNumberInYear}`);
            if (weekNumberInYear <= 0) {
                throw new PreCiseException(`invalid date given for meeting, unable to determine week number in year.`);
            }

            const meetings: Meeting[] = this.getWeeklyMeetingsInYear(date, names);
            Logger.log(Logger.LogLevel.DEBUG, Meetings, Meetings.getWeeklyMeetingsInYear, `meetings.length = ${meetings.length}`);
            if (!meetings) {
                throw new PreCiseException(`unable to generate weekly meetings.`);
            }

            const meetingForWeek: Meeting | undefined = meetings.find(meeting => meeting.id === weekNumberInYear);
            if (!meetingForWeek) {
                throw new PreCiseException(`unable to find the weekly meeting for the given date from the list of generated meetings.`);
            }
            if (!meetingForWeek.attendees) {
                throw new PreCiseException(`generated weekly meeting failed to populate the list of attendees.`);
            }

            randomizedNames = meetingForWeek.attendees;

        } catch (error) {
            randomizedNames = new Array<string>();
            if (error instanceof Error) {
                Logger.error(Logger.LogLevel.WARN, Meetings, Meetings.getMeetingForWeek, error);
            } else {
                console.error("Caught Unknown Error", error);
            }
        }

        return randomizedNames;
    }
}