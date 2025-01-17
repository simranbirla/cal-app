import React from 'react'
import { requireUser } from '../lib/hooks'
import { redirect } from 'next/navigation';
import { prisma } from '../lib/db';
import { EmptyState } from '../components/EmptyState';

async function getData(id: string) {
    const data = await prisma.user.findUnique({
        where: {
            id: id,
        },
        select: {
            eventType: {
                select: {
                    id: true,
                    active: true,
                    title: true,
                    url: true,
                    duration: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
            username: true,
            grantId: true,
        },
    });

    if (!data?.username) {
        return redirect("/onboarding");
    }


    if (!data?.grantId) {
        return redirect("/onboarding/grant-id")
    }

    return data;
}

export default async function DashboardPage() {
    const session = await requireUser()

    const data = await getData(session.user?.id as string);

    return (
        <div>
            {data.eventType.length === 0 ? <EmptyState
                title="You have no Event Types"
                description="You can create your first event type by clicking the button below."
                buttonText="Add Event Type"
                href="/dashboard/new"
            /> : <></>}
        </div>
    )
}
