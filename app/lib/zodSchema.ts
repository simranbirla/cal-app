import { conformZodMessage } from '@conform-to/zod'
import z from 'zod'

export const onBoardingSchema = z.object({
    fullName: z.string().min(3).max(150),
    username: z.string().min(3).max(150).regex(/^[a-zA-Z0-9-]+$/, {
        message: "Username must contain only letters, numbers, and hyphens",
    })
})


export const onBoardingSchemaValidation = (options?: {
    isUsernameUnique: () => Promise<boolean>
}) => {
    return z.object({
        fullName: z.string().min(3).max(150),
        username: z.string().min(3).max(150).regex(/^[a-zA-Z0-9-]+$/, {
            message: "Username must contain only letters, numbers, and hyphens",
        }).pipe(
            z.string().superRefine((_, ctx) => {
                if (typeof options?.isUsernameUnique !== "function") {
                    ctx.addIssue({
                        code: 'custom',
                        message: conformZodMessage.VALIDATION_UNDEFINED,
                        fatal: true
                    })

                    return;
                }

                return options.isUsernameUnique().then((isUnique) => {
                    if (!isUnique) {
                        ctx.addIssue({
                            code: "custom",
                            message: "Username is already used",
                        });
                    }
                });
            })
        )
    })
}

export const settingsSchema = z.object({
    fullName: z.string().min(3).max(150),
    image: z.string()
})

export const eventTypeSchema = z.object({
    title: z.string().min(3).max(150),
    duration: z.number().min(1).max(100),
    url: z.string().min(3).max(150),
    description: z.string().min(3).max(300),
    videoCallSoftware: z.string(),
});


export const eventTypeServerSchemaValidation = (options?: {
    isUrlUnique: () => Promise<boolean>
}) => {
    return z.object({
        title: z.string().min(3).max(150),
        duration: z.number().min(1).max(100),
        description: z.string().min(3).max(300),
        videoCallSoftware: z.string(),
        url: z.string().min(3).max(150).pipe(
            z.string().superRefine((_, ctx) => {
                if (typeof options?.isUrlUnique !== "function") {
                    ctx.addIssue({
                        code: 'custom',
                        message: conformZodMessage.VALIDATION_UNDEFINED,
                        fatal: true
                    })

                    return;
                }

                return options.isUrlUnique().then((isUnique) => {
                    if (!isUnique) {
                        ctx.addIssue({
                            code: "custom",
                            message: "Url is already used",
                        });
                    }
                });
            })
        )
    })
}