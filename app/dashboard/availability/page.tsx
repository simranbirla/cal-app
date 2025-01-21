import { updateAvailabilityAction } from '@/app/actions';
import { SubmitButton } from '@/app/components/SubmitButtons';
import { prisma } from '@/app/lib/db'
import { requireUser } from '@/app/lib/hooks';
import { times } from '@/app/lib/time';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { notFound } from 'next/navigation';
import React from 'react'

const getData = async (userId: string) => {
    const data = await prisma.availability.findMany({
        where: {
            userId
        },
        orderBy: {
            createdAt: 'asc'
        }
    });

    if (!data) {
        return notFound()
    }


    return data
}

export default async function AvailabilityPage() {
    const session = await requireUser()
    const availability = await getData(session?.user?.id as string)

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Availability
                </CardTitle>
                <CardDescription>
                    In this section you can manage your availability!
                </CardDescription>
            </CardHeader>
            <form action={updateAvailabilityAction}>
                <CardContent className='flex flex-col gap-y-4'>
                    {availability.map(avail => {
                        return <div key={avail.id} className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-4'>
                            <input type='hidden' name={`id-${avail.id}`} value={avail.id} />
                            <div className='flex items-center gap-x-3'>
                                <Switch name={`isActive-${avail.id}`} defaultChecked={avail.isActive} />
                                <p>{avail.day}</p>
                            </div>
                            <Select name={`fromTime-${avail.id}`} defaultValue={avail.fromTime}>
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='From Time' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {times.map(time => <SelectItem key={time.id} value={time.time}>
                                            {time.time}
                                        </SelectItem>)}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Select name={`tillTime-${avail.id}`} defaultValue={avail.tillTime}>
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Till Time' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {times.map(time => <SelectItem key={time.id} value={time.time}>
                                            {time.time}
                                        </SelectItem>)}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    })}
                </CardContent>
                <CardFooter>
                    <SubmitButton text='Save Changes' />
                </CardFooter>
            </form>

        </Card>
    )
}
