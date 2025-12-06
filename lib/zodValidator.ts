import { z } from "zod"
import type { IInputErrorState } from "./getInputFieldError"

export const zodValidator = <T>(payload: T, schema: z.ZodTypeAny): IInputErrorState | { success: true; data: any } => {
    const validatedPayload = schema.safeParse(payload)

    if (!validatedPayload.success) {
        return {
            success: false,
            errors: validatedPayload.error.issues.map(issue => {
                return {
                    field: String(issue.path[0] ?? ""),
                    message: issue.message,
                }
            })
        }
    }

    return {
        success: true,
        data: validatedPayload.data,
    };
}

