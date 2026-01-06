import z from "zod";
export const createUserSchema = z.object({
  username: z.string().min(3),
  email: z.email(),
  password: z
    .string()
    .min(6)
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
      "Password must be at least 6 characters long and contain at least one letter and one number."
    ),
  fullName: z.string().min(3),
});
