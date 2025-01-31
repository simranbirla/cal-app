/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { prisma } from "./lib/db"
import { requireUser } from "./lib/hooks"
import { parseWithZod } from '@conform-to/zod'
import { eventTypeServerSchemaValidation, onBoardingSchemaValidation, settingsSchema } from "./lib/zodSchema"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { nylas } from "./lib/nylas"

export const onBoardingAction = async (prevState: any, formData: FormData) => {
    const session = await requireUser()


    const submission = await parseWithZod(formData, {
        schema: onBoardingSchemaValidation({
            async isUsernameUnique() {
                const user = await prisma.user.findUnique({
                    where: {
                        username: formData.get("username") as string,
                    },
                });
                return !user;
            },

        }),
        async: true
    })


    if (submission.status !== 'success') {
        return submission.reply()
    }

    await prisma.user.update({
        where: {
            id: session.user?.id
        },
        data: {
            username: submission.value.username,
            name: submission.value.fullName,
            availability: {
                createMany: {
                    data: [
                        {
                            day: 'Monday',
                            fromTime: "08:00",
                            tillTime: '18:00'
                        },

                        {
                            day: 'Tuesday',
                            fromTime: "08:00",
                            tillTime: '18:00'
                        },

                        {
                            day: 'Wednesday',
                            fromTime: "08:00",
                            tillTime: '18:00'
                        }
                        ,
                        {
                            day: 'Thursday',
                            fromTime: "08:00",
                            tillTime: '18:00'
                        }
                        ,
                        {
                            day: 'Friday',
                            fromTime: "08:00",
                            tillTime: '18:00'
                        }
                        ,
                        {
                            day: 'Saturday',
                            fromTime: "08:00",
                            tillTime: '18:00'
                        },
                        {
                            day: 'Sunday',
                            fromTime: "08:00",
                            tillTime: '18:00'
                        }
                    ]
                }
            }
        }
    })


    return redirect('/onboarding/grant-id')
}

export const settingsAction = async (prevState: any, formData: FormData) => {
    const session = await requireUser()


    const submission = parseWithZod(formData, {
        schema: settingsSchema
    });

    if (submission.status !== 'success') {
        return submission.reply()
    }

    await prisma.user.update({
        where: {
            id: session.user?.id
        },
        data: {
            name: submission.value.fullName,
            image: submission.value.image
        }
    })


    return redirect('/dashboard')
}

export const updateAvailabilityAction = async (formData: FormData) => {
    const session = await requireUser();

    const rawData = Object.fromEntries(formData.entries());

    const availabilityData = Object.keys(rawData).filter((key) => key.startsWith('id-')).map(key => {
        const id = key.replace('id-', "")

        return {
            id,
            isActive: rawData[`isActive-${id}`] === "on",
            fromTime: rawData[`fromTime-${id}`] as string,
            tillTime: rawData[`tillTime-${id}`] as string,
        }
    })

    try {
        await prisma.$transaction(
            availabilityData.map((item) =>
                prisma.availability.update({
                    where: { id: item.id, userId: session.user?.id },
                    data: {
                        isActive: item.isActive,
                        fromTime: item.fromTime,
                        tillTime: item.tillTime,
                    },
                })
            )
        );

        revalidatePath("/dashboard/availability");
    } catch (error) {
        console.error("Error updating availability:", error);
    }

}

export const createEventTypeAction = async (prevState: any, formData: FormData) => {
    const session = await requireUser();

    const submission = await parseWithZod(formData, {
        schema: eventTypeServerSchemaValidation({
            async isUrlUnique() {
                const data = await prisma.eventType.findFirst({
                    where: {
                        userId: session.user?.id,
                        url: formData.get("url") as string,
                    },
                });
                return !data;
            },
        }),

        async: true,
    });
    if (submission.status !== "success") {
        return submission.reply();
    }


    try {
        await prisma.eventType.create({
            data: {
                title: submission.value.title,
                duration: submission.value.duration,
                url: submission.value.url,
                description: submission.value.description,
                userId: session.user?.id as string,
                videoCallSoftware: submission.value.videoCallSoftware,
            },
        });

    } catch (error) {
        console.error("Error creating event:", error);
    }

    return redirect("/dashboard");


}

export async function updateEventTypeStatusAction(
    prevState: any,
    {
        eventTypeId,
        isChecked,
    }: {
        eventTypeId: string;
        isChecked: boolean;
    }
) {
    try {
        const session = await requireUser();

        await prisma.eventType.update({
            where: {
                id: eventTypeId,
                userId: session.user?.id as string,
            },
            data: {
                active: isChecked,
            },
        });

        revalidatePath(`/dashboard`);
        return {
            status: "success",
            message: "EventType Status updated successfully",
        };
    } catch (error) {
        console.log('Error while updating event type', error)
        return {
            status: "error",
            message: "Something went wrong",
        };
    }
}

export const createMeetingAction = async (formData: FormData) => {
    const userData = await prisma.user.findUnique({
        where: {
            username: formData.get("username") as string
        },
        select: {
            grantEmail: true,
            grantId: true
        }
    })


    if (!userData) {
        throw new Error("User not found")
    }

    const eventType = await prisma.eventType.findUnique({
        where: {
            id: formData.get("eventTypeId") as string
        },
        select: {
            title: true,
            description: true
        }
    })


    const formTime = formData.get("fromTime") as string;
    const duration = Number(formData.get("duration"));
    const eventDate = formData.get("eventDate") as string;

    const startDateTime = new Date(`${eventDate}T${formTime}:00`);
    const endDateTime = new Date(startDateTime.getTime() + duration * 60000);
    const provider = formData.get("provider") as any




    await nylas.events.create({
        identifier: userData.grantId as string,
        requestBody: {
            title: eventType?.title,
            description: eventType?.description,
            when: {
                startTime: Math.floor(startDateTime.getTime() / 1000),
                endTime: Math.floor(endDateTime.getTime() / 1000),
            },
            conferencing: {
                autocreate: {},
                provider,
            },
            participants: [
                {
                    name: formData.get("name") as string,
                    email: formData.get("email") as string,
                    status: "yes",
                },
            ],
        },
        queryParams: {
            calendarId: userData?.grantEmail as string,
            notifyParticipants: true,
        }
    })
    return redirect("/success");

}


export const cancelMeetingAction = async (formData: FormData) => {
    const session = await requireUser();

    const userData = await prisma.user.findUnique({
        where: {
            id: session.user?.id as string,
        },
        select: {
            grantEmail: true,
            grantId: true,
        },
    });

    if (!userData) {
        throw new Error("User not found");
    }

    await nylas.events.destroy({
        eventId: formData.get("eventId") as string,
        identifier: userData?.grantId as string,
        queryParams: {
            calendarId: userData?.grantEmail as string,
        },
    });

    revalidatePath("/dashboard/meetings");

}

export const editEventTypeAction = async (prevState: any, formData: FormData) => {
    const session = await requireUser();

    const submission = await parseWithZod(formData, {
        schema: eventTypeServerSchemaValidation({
            async isUrlUnique() {
                const data = await prisma.eventType.findFirst({
                    where: {
                        userId: session.user?.id,
                        url: formData.get("url") as string,
                    },
                });
                return !data;
            },
        }),

        async: true,
    });

    if (submission.status !== "success") {
        return submission.reply();
    }

    await prisma.eventType.update({
        where: {
            id: formData.get("id") as string,
            userId: session.user?.id as string,
        },
        data: {
            title: submission.value.title,
            duration: submission.value.duration,
            url: submission.value.url,
            description: submission.value.description,
            videoCallSoftware: submission.value.videoCallSoftware,
        },
    });

    return redirect("/dashboard");
}

export const deleteEventTypeAction = async (formData: FormData) => {
    const session = await requireUser();

    await prisma.eventType.delete({
        where: {
            id: formData.get("id") as string,
            userId: session.user?.id as string,
        },
    });

    return redirect("/dashboard");
}
