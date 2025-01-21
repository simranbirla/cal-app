"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Calendar } from "./Calendar";
import { useState, useEffect } from "react";
import {
    CalendarDate,
    DateValue,
    getLocalTimeZone,
    today,
    parseDate,
} from "@internationalized/date";

interface ICalendarProps {
    daysofWeek: { day: string; isActive: boolean }[];
}

export default function RenderCalendar({ daysofWeek }: ICalendarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [date, setDate] = useState<CalendarDate>(() => {
        const dateParam = searchParams.get("date");
        return dateParam ? parseDate(dateParam) : today(getLocalTimeZone());
    });

    useEffect(() => {
        const dateParam = searchParams.get("date");
        if (dateParam) {
            setDate(parseDate(dateParam));
        }
    }, [searchParams]);

    const handleChangeDate = (date: DateValue) => {
        console.log(date);
        setDate(date as CalendarDate);
        const url = new URL(window.location.href);

        url.searchParams.set("date", date.toString());

        router.push(url.toString());
    };

    const isDateUnavailable = (date: DateValue) => {
        const dayOfWeek = date.toDate(getLocalTimeZone()).getDay();
        const adjustedIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        return !daysofWeek[adjustedIndex].isActive;
    };

    return (
        <Calendar
            minValue={today(getLocalTimeZone())}
            defaultValue={today(getLocalTimeZone())}
            value={date}
            onChange={handleChangeDate}
            isDateUnavailable={isDateUnavailable}
        />
    );
}