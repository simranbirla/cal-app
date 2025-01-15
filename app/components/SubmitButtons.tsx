"use client"

import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { useFormStatus } from "react-dom"
import GoogleLogo from '@/public/google.svg'
import GithubLogo from '@/public/github.svg'
import { Loader2 } from "lucide-react"

export const GoogleAuthButton = () => {
    const { pending } = useFormStatus();


    return <>
        {pending ? <Button disabled variant={'outline'} className="w-full">
            <Loader2 className="size-4 mr-2 animate-spin" />
            Please wait
        </Button> : <Button variant={'outline'} className="w-full">
            <Image src={GoogleLogo} alt="google logo" className="size-4 mr-2" />
            Sign In with Google</Button>}
    </>
}

export const GithubAuthButton = () => {
    const { pending } = useFormStatus();


    console.log(pending)

    return <>
        {pending ? <Button disabled variant={'outline'} className="w-full">
            <Loader2 className="size-4 mr-2 animate-spin" />
            Please wait
        </Button> : <Button variant={'outline'} className="w-full">
            <Image src={GithubLogo} alt="github logo" className="size-4 mr-2" />
            Sign In with Github</Button>}
    </>
}