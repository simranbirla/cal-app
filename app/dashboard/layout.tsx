/* eslint-disable @next/next/no-img-element */
import React from 'react'
import Logo from '../components/Logo';
import Link from 'next/link';
import DashboardLinks from '../components/DashboardLinks';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MenuIcon } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { signOut } from '../lib/auth';
import { requireUser } from '../lib/hooks';
import { Toaster } from "@/components/ui/sonner"


export default async function DashboardLayout({ children }: { children: React.ReactNode; }) {
    const session = await requireUser()

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
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button className='md:hidden shrink-0' size={'icon'} variant={'outline'}>
                                    <MenuIcon />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side={'left'} className='flex flex-col'>
                                <nav className='grid gap-2'>
                                    <DashboardLinks />
                                </nav>
                            </SheetContent>
                        </Sheet>
                        <div className='ml-auto flex items-center gap-x-4'>
                            <ThemeToggle />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant={'secondary'} size={'icon'} className='rounded-full'>
                                        <img src={session?.user?.image as string} alt='Profile image' width={20} height={20} className='w-full h-full rounded-full' />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                    <DropdownMenuLabel>
                                        My Account
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/settings">Settings</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <form className='w-full' action={async () => {
                                            "use server"
                                            await signOut()
                                        }}><button className='w-full text-left'>Log Out</button></form>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </header>
                    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                        {children}
                    </main>
                </div>
            </div>
            <Toaster richColors />
        </>

    )
}
