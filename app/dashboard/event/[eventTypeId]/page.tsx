import EventTypeForm from '@/app/components/EventTypeForm';
import { prisma } from '@/app/lib/db';
import { notFound } from 'next/navigation';
import React from 'react'


const getData = async (eventId: string) => {
    const data = await prisma.eventType.findUnique({
        where: {
            id: eventId
        },
        select: {
            title: true,
            description: true,
            duration: true,
            url: true,
            id: true,
            videoCallSoftware: true,
        }
    })


    if (!data) {
        return notFound();
    }

    return data;
}

export default async function EditEventPage({ params }: { params: Promise<{ eventTypeId: string }> }) {
    const { eventTypeId } = await params
    const data = await getData(eventTypeId);

    return (
        <EventTypeForm
            description={data.description}
            duration={data.duration}
            title={data.title}
            url={data.url}
            key={data.id}
            id={data.id}
            callProvider={data.videoCallSoftware}
        />
    );
}
