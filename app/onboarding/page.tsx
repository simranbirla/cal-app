"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useActionState } from 'react'
import { onBoardingAction } from '../actions'
import { useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { onBoardingSchema } from '../lib/zodSchema'
import { SubmitButton } from '../components/SubmitButtons'

export default function OnBoardingPage() {

    const [lastResult, action] = useActionState(onBoardingAction, undefined)

    const [form, fields] = useForm({
        lastResult,
        onValidate({ formData }) {
            return parseWithZod(formData, { schema: onBoardingSchema })
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput"
    })

    return (
        <div className='min-h-screen w-screen flex items-center justify-center'>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Welcome to Cal<span className='text-primary'>App</span>
                    </CardTitle>
                    <CardDescription>We need following information to set up the profile</CardDescription>
                </CardHeader>
                <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
                    <CardContent className='flex flex-col gap-y-5 '>
                        <div className='grid gap-y-2'>
                            <Label>FullName</Label>
                            <Input placeholder='Fullname' name={fields.fullName.name}
                                defaultValue={fields.fullName.initialValue}
                                key={fields.fullName.key}
                            />
                            <p className='text-red-500 text-sm'>{fields.fullName.errors}</p>
                        </div>
                        <div className='grid gap-y-2'>
                            <Label>Username</Label>
                            <div className='flex rounded-md'>
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-muted bg-muted text-muted-foreground text-sm">
                                    CalApp.com/
                                </span>
                                <Input placeholder='example-user' className="rounded-l-none" type="text"
                                    key={fields.username.key}
                                    defaultValue={fields.username.initialValue}
                                    name={fields.username.name} />
                            </div>
                            <p className='text-red-500 text-sm'>{fields.username.errors}</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <SubmitButton text={"Submit"} className='w-full' />
                    </CardFooter>
                </form>

            </Card>
        </div>
    )
}
