import Link from 'next/link'
import React from 'react'
import { CalendarRange } from 'lucide-react';


export default function Navbar() {
    return (
        <div className='flex py-5 items-center justify-between'>
            <Link href={'/'} className='flex items-center gap-2'>
                <div className='bg-blue-500 rounded-lg'>
                    <CalendarRange className='h-10 w-10 p-2 text-white' />
                </div>
                <h4 className='text-3xl font-semibold'>Cal <span className='text-blue-500'>App</span></h4>
            </Link>
            <button>Get Started Today</button>
        </div>
    )
}



