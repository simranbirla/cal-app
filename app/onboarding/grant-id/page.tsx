import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import VideoGif from '@/public/work-is-almost-over-happy.gif';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CalendarCheck2 } from 'lucide-react';


export default function OnBoardingGrantItRoutePage() {
    return (
        <div className='min-h-screen w-screen flex items-center justify-center'>
            <Card>
                <CardHeader>
                    <CardTitle>You are almost done!</CardTitle>
                    <CardDescription>We have to connect the calender to your account</CardDescription>
                    <Image src={VideoGif} alt='Almost Done' className='w-full rounded-lg' />
                </CardHeader>
                <CardContent>
                    <Button className='w-full' asChild>
                        <Link href={'/'}>
                            <CalendarCheck2 className='size-4 mr-2' />
                            Connect Calender to your account</Link>

                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
