"use client"

import { createEventTypeAction } from '@/app/actions';
import { SubmitButton } from '@/app/components/SubmitButtons';
import { eventTypeSchema } from '@/app/lib/zodSchema';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Platform } from '@/lib/utils';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import Link from 'next/link';
import React, { useActionState, useState } from 'react'

export default function NewEvent() {
    const [lastResult, action] = useActionState(createEventTypeAction, undefined);
    const [form, fields] = useForm({
        lastResult,
        onValidate({ formData }) {
            return parseWithZod(formData, { schema: eventTypeSchema });
        },

        // Validate the form on blur event triggered
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    });
    const [activePlatform, setActivePlatform] = useState<Platform>("Google Meet");

    const togglePlatform = (platform: Platform) => {
        setActivePlatform(platform);
    };

    return (
        <div className="h-full w-full flex-1 flex flex-col items-center justify-center">
            <Card>
                <CardHeader>
                    <CardTitle>Add new appointment type</CardTitle>
                    <CardDescription>
                        Create a new appointment type that allows people to book times.
                    </CardDescription>
                </CardHeader>
                <form noValidate id={form.id} onSubmit={form.onSubmit} action={action}>
                    <CardContent className="grid gap-y-5">
                        <div className="flex flex-col gap-y-2">
                            <Label>Title</Label>
                            <Input
                                name={fields.title.name}
                                key={fields.title.key}
                                defaultValue={fields.title.initialValue}
                                placeholder="30 min meeting"
                            />
                            <p className="text-red-500 text-sm">{fields.title.errors}</p>
                        </div>

                        <div className="grid gap-y-2 ">
                            <Label>URL Slug</Label>
                            <div className="flex rounded-md">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-muted bg-muted text-muted-foreground text-sm">
                                    CalApp.com/
                                </span>
                                <Input
                                    type="text"
                                    key={fields.url.key}
                                    defaultValue={fields.url.initialValue}
                                    name={fields.url.name}
                                    placeholder="example-user-1"
                                    className="rounded-l-none"
                                />
                            </div>

                            <p className="text-red-500 text-sm">{fields.url.errors}</p>
                        </div>

                        <div className="grid gap-y-2">
                            <Label>Description</Label>
                            <Textarea
                                name={fields.description.name}
                                key={fields.description.key}
                                defaultValue={fields.description.initialValue}
                                placeholder="30 min meeting"
                            />
                            <p className="text-red-500 text-sm">
                                {fields.description.errors}
                            </p>
                        </div>

                        <div className="grid gap-y-2">
                            <Label>Duration</Label>
                            <Select
                                name={fields.duration.name}
                                key={fields.duration.key}
                                defaultValue={fields.duration.initialValue}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select the duration" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Duration</SelectLabel>
                                        <SelectItem value="15">15 Mins</SelectItem>
                                        <SelectItem value="30">30 Min</SelectItem>
                                        <SelectItem value="45">45 Mins</SelectItem>
                                        <SelectItem value="60">1 Hour</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <p className="text-red-500 text-sm">{fields.duration.errors}</p>
                        </div>

                        <div className="grid gap-y-2">
                            <input
                                type="hidden"
                                name={fields.videoCallSoftware.name}
                                value={activePlatform}
                            />
                            <Label>Video Call Provider</Label>
                            <ButtonGroup className="w-full">
                                <Button
                                    onClick={() => togglePlatform("Zoom Meeting")}
                                    type="button"
                                    className="w-full"
                                    variant={
                                        activePlatform === "Zoom Meeting" ? "secondary" : "outline"
                                    }
                                >
                                    Zoom
                                </Button>
                                <Button
                                    onClick={() => togglePlatform("Google Meet")}
                                    type="button"
                                    className="w-full"
                                    variant={
                                        activePlatform === "Google Meet" ? "secondary" : "outline"
                                    }
                                >
                                    Google Meet
                                </Button>
                                <Button
                                    variant={
                                        activePlatform === "Microsoft Teams"
                                            ? "secondary"
                                            : "outline"
                                    }
                                    type="button"
                                    className="w-full"
                                    onClick={() => togglePlatform("Microsoft Teams")}
                                >
                                    Microsoft Teams
                                </Button>
                            </ButtonGroup>
                        </div>
                    </CardContent>
                    <CardFooter className="w-full flex justify-between">
                        <Button asChild variant="secondary">
                            <Link href="/dashboard">Cancel</Link>
                        </Button>
                        <SubmitButton text="Create Event Type" />
                    </CardFooter>
                </form>
            </Card>
        </div>
    );

}
