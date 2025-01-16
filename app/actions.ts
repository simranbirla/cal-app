/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { prisma } from "./lib/db"
import { requireUser } from "./lib/hooks"
import { parseWithZod } from '@conform-to/zod'
import { onBoardingSchemaValidation } from "./lib/zodSchema"
import { redirect } from "next/navigation"

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
        }
    })


    return redirect('dashboard')
}