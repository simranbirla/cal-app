import { CalendarRange } from 'lucide-react'
import React from 'react'

export default function Logo({ classname }: { classname?: string }) {
    return (
        <div className='bg-blue-500 rounded-lg'>
            <CalendarRange className={`h-10 w-10 p-2 text-white ${classname}`} />
        </div>
    )
}
