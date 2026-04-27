import { z } from "zod";

export const signupInput = z.object({
  email: z.email().max(254),
  password: z.string().min(8).max(128),
  name: z.string().trim().min(1).max(80).optional(),
});

export const loginInput = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const passwordResetRequestInput = z.object({
  email: z.email(),
});

export const passwordResetConfirmInput = z.object({
  token: z.string().min(20),
  password: z.string().min(8).max(128),
});

export const profileUpdateInput = z.object({
  name: z.string().trim().min(1).max(80).nullish(),
  bio: z.string().max(1000).nullish(),
  timezone: z.string().min(1).max(64).optional(),
});

export type SignupInput = z.infer<typeof signupInput>;
export type LoginInput = z.infer<typeof loginInput>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateInput>;
