import React from 'react'
import { requireUser } from '../lib/hooks'
import { redirect } from 'next/navigation';
import { prisma } from '../lib/db';

async function getData(id: string) {
    const data = await prisma.user.findUnique({
        where: {
            id: id,
        },
        select: {
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

    await getData(session.user?.id as string);

    return (
        <div>Dashboard</div>
    )
}
