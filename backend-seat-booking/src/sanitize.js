import { z } from "zod";

const userSignupSchema = z.object({
    name: z.string().optional(),
    email: z.string({
        required_error: "Email field is empty!",
        invalid_type_error: "Email is not valid"
    }).email({ message: "Invalid email address" }),
    password: z.string({
        required_error: "Password field is empty!",
    })
    .min(8, { message: "password length must be greater than 8 and less than 15" })
    .max(15, { message: "password length must be greater than 8 and less than 15" })
});

const userSigninSchema = z.object({
    email: z.string({
        required_error: "Email field is empty!",
        invalid_type_error: "Email is not valid"
    }).email({ message: "Invalid email address" }),
    password: z.string({
        required_error: "Password field is empty!",
    })
});


export function signinValidation(inputs) {
    const result = userSigninSchema.safeParse(inputs);
    if(!result.success) {
        return {status: "error", message: result.error.errors};
    }
    return {status: "success", message: result};
}

export function signupValidation(inputs) {
    const result = userSignupSchema.safeParse(inputs);
    if(!result.success) {
        return {status: "error", message: result.error.errors};
    }
    return {status: "success", message: result};
}