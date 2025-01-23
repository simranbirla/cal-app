/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { addMinutes, format, fromUnixTime, isAfter, isBefore, parse } from 'date-fns'
import { prisma } from '../lib/db';
import { Prisma } from '@prisma/client';
import { nylas } from '../lib/nylas';
import { FreeBusy, GetFreeBusyResponse, NylasResponse } from 'nylas';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export interface ITimeTable {
    selectedDate: Date;
    username: string
    meetingDuration: number
}


const calculateAvailableTimeSlots = (
    dbAvailability: {
        fromTime: string | undefined;
        tillTime: string | undefined;
    },
    nylasData: NylasResponse<GetFreeBusyResponse[]>,
    date: string,
    duration: number
) => {
    const now = new Date()

    const availableFrom = parse(`${date} ${dbAvailability.fromTime}`, 'yyyy-MM-dd HH:mm', new Date())
    const availableTill = parse(`${date} ${dbAvailability.tillTime}`, 'yyyy-MM-dd HH:mm', new Date())



    const busySlots = (nylasData.data[0] as FreeBusy).timeSlots.map((slot) => ({
        start: fromUnixTime(slot.startTime),
        end: fromUnixTime(slot.endTime)
    }))

    const allSlots = []
    let currentSlot = availableFrom;

    while (isBefore(currentSlot, availableTill)) {
        allSlots.push(currentSlot)
        currentSlot = addMinutes(currentSlot, duration)
    }

    const freeSlots = allSlots.filter(slot => {
        const slotEnd = addMinutes(slot, duration)

        return (isAfter(slot, now) && !busySlots.some(
            (busy: { start: any; end: any }) =>
                (!isBefore(slot, busy.start) && isBefore(slot, busy.end)) ||
                (isAfter(slotEnd, busy.start) && !isAfter(slotEnd, busy.end)) ||
                (isBefore(slot, busy.start) && isAfter(slotEnd, busy.end))
        ))
    })

    return freeSlots.map(slot => format(slot, 'HH:mm'))
}


const getData = async (date: Date, username: string) => {
    const day = format(date, 'EEEE') as Prisma.EnumDayFilter;
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const data = await prisma.availability.findFirst({
        where: {
            day,
            User: {
                username
            }
        },
        select: {
            fromTime: true,
            tillTime: true,
            id: true,
            User: {
                select: {
                    grantEmail: true,
                    grantId: true
                }

            }
        }
    })


    const nylasCalendarData = await nylas.calendars.getFreeBusy({
        identifier: data?.User?.grantId as string,
        requestBody: {
            startTime: Math.floor(startOfDay.getTime() / 1000),
            endTime: Math.floor(endOfDay.getTime() / 1000),
            emails: [data?.User?.grantEmail as string]

        }
    })


    return {
        data,
        nylasCalendarData
    };
}

export default async function TimeTable({ selectedDate, username, meetingDuration }: ITimeTable) {
    const { data, nylasCalendarData } = await getData(selectedDate, username)
    const dbAvailability = { fromTime: data?.fromTime, tillTime: data?.tillTime };

    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    const availableSlots = calculateAvailableTimeSlots(dbAvailability, nylasCalendarData, formattedDate, meetingDuration)

    return (
        <div>
            <p className='text-base font-semibold'>
                {format(selectedDate, "EEE")}{" "}
                <span className='text-sm text-muted-foreground'>  {format(selectedDate, "MMM.d")}</span>

            </p>

            <div className='mt-3 max-h-[350px] overflow-y-auto'>
                {availableSlots.length > 0 ? (
                    availableSlots.map((slot, index) => (
                        <Link
                            key={index}
                            href={`?date=${format(selectedDate, "yyyy-MM-dd")}&time=${slot}`}
                        >
                            <Button variant="outline" className="w-full mb-2">
                                {slot}
                            </Button>
                        </Link>
                    ))
                ) : (
                    <p>No available time slots for this date.</p>
                )}
            </div>
        </div>
    )
}
