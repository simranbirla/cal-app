import React from 'react'
import { DateValue, useCalendarGrid, useLocale } from 'react-aria';
import { DateDuration, endOfMonth, getWeeksInMonth } from '@internationalized/date';
import { CalendarState } from 'react-stately';
import { CalendarCell } from './CalendarCell';

export default function CalendarGrid({ state, offset = {}, isDateUnavailable }: {
    state: CalendarState, offset?: DateDuration, isDateUnavailable?: (date: DateValue) => boolean;
}) {
    const { locale } = useLocale();
    const startDate = state.visibleRange.start.add(offset)
    const endDate = endOfMonth(startDate)
    const { gridProps, headerProps, weekDays } = useCalendarGrid({
        startDate,
        endDate,
        weekdayStyle: 'short'
    }, state);

    const weeksInMonth = getWeeksInMonth(startDate, locale);


    return (
        <table {...gridProps} cellPadding={0} className='flex-1'>
            <thead {...headerProps} className='text-sm font-medium'>
                <tr>
                    {weekDays.map((day, index) => <th key={index}>{day}</th>)}
                </tr>
            </thead>
            <tbody>
                {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
                    <tr key={weekIndex}>
                        {state.getDatesInWeek(weekIndex).map((date, i) => (
                            date
                                ? (
                                    <CalendarCell
                                        key={i}
                                        state={state}
                                        date={date}
                                        currentMonth={startDate}
                                        isUnavailable={isDateUnavailable?.(date)}
                                    />
                                )
                                : <td key={i} />
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

