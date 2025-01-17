"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useActionState, useState } from 'react'
import { SubmitButton } from './SubmitButtons'
import { settingsAction } from '../actions'
import { useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { settingsSchema } from '../lib/zodSchema'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { UploadDropzone } from '../lib/uploadthing'
import { toast } from 'sonner'

interface ISettingsForm {
    name: string,
    email: string,
    image: string
}

export default function SettingsForm({ email, name, image }: ISettingsForm) {
    const [lastResult, action] = useActionState(settingsAction, undefined)
    const [currentImage, setCurrentImage] = useState(image)


    const handleDeleteImage = () => {
        setCurrentImage('')
    }

    const [form, fields] = useForm({
        lastResult,
        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: settingsSchema
            })
        },
        shouldValidate: 'onBlur',
        shouldRevalidate: 'onInput'
    })

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Settings
                </CardTitle>
                <CardDescription>
                    Manage your account settings.
                </CardDescription>
            </CardHeader>
            <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
                <CardContent className='flex flex-col gap-y-4'>
                    <div className='flex flex-col gap-y-2'>
                        <Label>Fullname</Label>
                        <Input name={fields.fullName.name}
                            key={fields.fullName.key} defaultValue={name} placeholder={name} />
                        <p className='text-red-500 text-sm'>{fields.fullName.errors}</p>
                    </div>
                    <div className='flex flex-col gap-y-2'>
                        <Label>Email</Label>
                        <Input defaultValue={email} placeholder={email} />
                    </div>
                    <div className='grid gap-y-2'>
                        <Label>Profile Image</Label>
                        <input type='hidden' name={fields.image.name} key={fields.image.key} value={currentImage} />
                        {currentImage ? (
                            <div className="relative size-16">
                                <Image
                                    src={currentImage}
                                    alt="Profile"
                                    width={300}
                                    height={300}
                                    className="rounded-lg size-16"
                                />
                                <Button
                                    type="button"
                                    onClick={handleDeleteImage}
                                    variant="destructive"
                                    size="icon"
                                    className="absolute -top-3 -right-3"
                                >
                                    <X className="size-4" />
                                </Button>
                            </div>
                        ) : (
                            <UploadDropzone
                                endpoint="imageUploader"
                                appearance={{
                                    container: "border-muted",
                                }}
                                onClientUploadComplete={(res) => {
                                    setCurrentImage(res[0].url);
                                    toast.success("Profile image uploaded");
                                }}
                                onUploadError={(error) => {
                                    toast.error(error.message);
                                }}
                            />

                        )}
                        <p className="text-red-500 text-sm">{fields.image.errors}</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <SubmitButton text='Save Changes' />

                </CardFooter>
            </form>
        </Card>
    )
}
