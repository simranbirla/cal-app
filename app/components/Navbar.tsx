import Link from 'next/link'
import React from 'react'
import AuthModal from './AuthModal';
import Logo from './Logo';


export default function Navbar() {
    return (
        <div className='flex py-5 items-center justify-between'>
            <Link href={'/'} className='flex items-center gap-2'>
                <Logo />
                <h4 className='text-3xl font-semibold'>Cal <span className='text-blue-500'>App</span></h4>
            </Link>
            <AuthModal />
        </div>
    )
}



