import React from 'react'
import Logo from '../components/Logo';
import Link from 'next/link';
import DashboardLinks from '../components/DashboardLinks';
import Navbar from '../components/Navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode; }) {
    return (
        <>
            <div className='min-h-screen w-full grid md:grid-cols-[220px_1fr] lg:grid-cols=[280px_1fr]'>
                <div className='hidden md:block border-r bg-muted/40'>
                    <div className='h-full flex max-h-screen flex-col gap-2'>
                        <div className='flex h-14 items-center border-b px-4 lg:h-[60px] lg:p-6'>
                            <Link href="/" className='flex items-center gap-2'>
                                <Logo classname='size-6' />
                                <p className='text-xl font-semibold'>Cal <span className='text-blue-500'>App</span></p>
                            </Link>
                        </div>
                        <div className='flex-1'>
                            <nav className='items-start grid px-2 lg:px-4'>
                                <DashboardLinks />
                            </nav>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col'>
                    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">

                    </header>
                </div>
            </div>
        </>

    )
}
