import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import React from 'react'
import Logo from './Logo'
import { signIn } from '../lib/auth'
import { GithubAuthButton, GoogleAuthButton } from './SubmitButtons'

export default function AuthModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button> Try for free</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[360px]'>
                <DialogTitle className='flex justify-center items-center gap-2 flex-row'>Authentication</DialogTitle>
                <DialogHeader className='flex justify-center items-center gap-2 flex-row'>
                    <Logo />
                    <h4 className='text-3xl font-semibold'>Cal <span className='text-primary'>App</span></h4>
                </DialogHeader>
                <div className='flex flex-col mt-5 gap-3'>
                    <form className='w-full' action={async () => {
                        "use server"
                        await signIn("google")
                    }}>
                        <GoogleAuthButton />
                    </form>
                    <form className='w-full' action={async () => {
                        "use server"
                        await signIn("github")
                    }}>
                        <GithubAuthButton />
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
