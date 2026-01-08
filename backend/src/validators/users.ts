import z from "zod";
export const createUserSchema = z.object({
  username: z.string().min(3),
  email: z.email(),
  password: z
    .string()
    .min(6)
    .regex(
      /(?=.*[A-Za-z])(?=.*\d)/,
      "Password must be at least 6 characters long and contain at least one letter and one number."
    ),
  fullName: z.string().min(3),
});

export const loginUserSchema = z
  .object({
    email: z.email().optional(),
    username: z.string().optional(),
    password: z.string().min(6),
  })
  .refine((data) => {
    const { email, username } = data;
    return email || username;
  }, "Email or username is required");
