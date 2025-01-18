import React from 'react'
import { requireUser } from '../lib/hooks'
import { redirect } from 'next/navigation';
import { prisma } from '../lib/db';
import { EmptyState } from '../components/EmptyState';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
        <>
            <div className="flex items-center justify-between px-2">
                <div className="sm:grid gap-1 hidden">
                    <h1 className="font-heading text-3xl md:text-4xl">Event Types</h1>
                    <p className="text-lg text-muted-foreground">
                        Create and manage your event types.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/new">Create New Event</Link>
                </Button>
            </div>
            {data.eventType.length === 0 ? <EmptyState
                title="You have no Event Types"
                description="You can create your first event type by clicking the button below."
                buttonText="Add Event Type"
                href="/dashboard/new"
            /> : <>Have types</>}
        </>
    )
}
