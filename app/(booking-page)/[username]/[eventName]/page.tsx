import RenderCalendar from '@/app/components/calendar/RenderCalendar';
import TimeTable from '@/app/components/TimeTable';
import { prisma } from '@/app/lib/db';
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator';
import { BookMarked, CalendarX2, Clock } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import React from 'react'

async function getData(username: string, eventName: string) {
    const eventType = await prisma.eventType.findFirst({
        where: {
            url: eventName,
            User: {
                username: username
            },
            active: true,
        },
        select: {
            id: true,
            description: true,
            title: true,
            duration: true,
            videoCallSoftware: true,

            User: {
                select: {
                    image: true,
                    name: true,
                    availability: {
                        select: {
                            day: true,
                            isActive: true,
                        },
                    },
                },
            },
        },
    });

    if (!eventType) {
        return notFound();
    }

    return eventType;
}

export default async function BookingForm({ params, searchParams }: { params: { username: string; eventName: string }, searchParams: { date?: string, time?: string } }) {
    const { username, eventName } = await params
    const { date } = await searchParams

    const data = await getData(username, eventName)

    const selectedDate = date
        ? new Date(date)
        : new Date();

    const formattedDate = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
    }).format(selectedDate);

    // const showForm = !!date && !!time;

    return (
        <div className='min-h-screen w-full flex items-center justify-center'>
            <Card className='max-w-[1000px] w-full mx-auto'>
                <CardContent className="p-5 grid md:grid-cols-[1fr,auto,1fr] gap-4">
                    <div>
                        <Image src={data.User?.image as string} alt='User Profile' className='size-10 rounded-full' width={30}
                            height={30} />
                        <p className="text-sm font-medium text-muted-foreground mt-1">
                            {data.User?.name}
                        </p>
                        <h1 className="text-xl font-semibold mt-2">{data.title}</h1>
                        <p className="text-sm font-medium text-muted-foreground">
                            {data.description}
                        </p>

                        <div className="mt-5 grid gap-y-3">
                            <p className="flex items-center">
                                <CalendarX2 className="size-4 mr-2 text-primary" />
                                <span className="text-sm font-medium text-muted-foreground">
                                    {formattedDate}
                                </span>
                            </p>
                            <p className="flex items-center">
                                <Clock className="size-4 mr-2 text-primary" />
                                <span className="text-sm font-medium text-muted-foreground">
                                    {data.duration} Mins
                                </span>
                            </p>
                            <p className="flex items-center">
                                <BookMarked className="size-4 mr-2 text-primary" />
                                <span className="text-sm font-medium text-muted-foreground">
                                    {data.videoCallSoftware}
                                </span>
                            </p>
                        </div>

                    </div>

                    <Separator
                        orientation="vertical"
                        className="hidden md:block h-full w-[1px]"
                    />

                    <RenderCalendar daysofWeek={data.User?.availability ?? []} />
                    <Separator orientation='vertical' className='h-full w-[1px]' />
                    <TimeTable selectedDate={selectedDate} />
                </CardContent>
                <CardHeader></CardHeader>
            </Card>
        </div>
    )
}
