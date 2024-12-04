import {z} from "zod"
import {User} from "../../entites/User"


export const userSchema=z.object({
    name: z
    .string()
    .min(2, "Full name must have at least 2 characters"),
  email: z
    .string()
    .email("Invalid email address"), 
  password: z
    .string()
    .min(8, "Password must have at least 8 characters with alphanumeric combination")
    .refine(password => /[A-Za-z]/.test(password), {
      message: "Password must contain at least one letter",
    })
    .refine(password => /[0-9]/.test(password), {
      message: "Password must contain at least one number",
    }),
})