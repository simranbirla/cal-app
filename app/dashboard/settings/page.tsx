import SettingsForm from '@/app/components/SettingsForm'
import { prisma } from '@/app/lib/db'
import { requireUser } from '@/app/lib/hooks'
import { notFound } from 'next/navigation'
import React from 'react'


const getData = async (id: string) => {
    const data = await prisma.user.findUnique({
        where: {
            id
        },
        select: {
            name: true,
            image: true,
            email: true,
        }
    })

    if (!data) {
        return notFound()
    }


    return data;
}

export default async function SettingsPage() {
    const session = await requireUser()

    const data = await getData(session.user?.id as string)

    return (
        <div><SettingsForm name={data.name as string} image={data.image as string} email={data.email as string} /></div>
    )
}
