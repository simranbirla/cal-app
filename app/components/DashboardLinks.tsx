"use client"

import { cn } from '@/lib/utils';
import { CalendarCheck, HomeIcon, LucideProps, Settings, Users2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

interface IAppProps {
    id: number,
    name: string,
    href: string,
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>,
}

export const dashboardLinks: IAppProps[] = [
    {
        id: 0,
        name: "Event Types",
        href: "/dashboard",
        icon: HomeIcon,
    },
    {
        id: 1,
        name: "Meetings",
        href: "/dashboard/meetings",
        icon: Users2,
    },
    {
        id: 2,
        name: "Availablity",
        href: "/dashboard/availability",
        icon: CalendarCheck,
    },
    {
        id: 3,
        name: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
    },
];


export default function DashboardLinks() {
    const pathname = usePathname();


    return (
        <>
            {dashboardLinks.map(link => {
                return <Link href={link.href} key={link.id} className={cn(pathname === link.href ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground', "flex items-center px-3 py-2 gap-3 rounded-lg transition-all hover:text-primary cursor-pointer ")}>
                    < link.icon className='size-4' />
                    {link.name}
                </Link >
            })}
        </>
    )
}
