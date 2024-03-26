import { userSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getUsers } from "@/lib/api/users/queries";


// Schema for users - used to validate API requests
const baseSchema = userSchema.omit(timestamps)

export const insertUserSchema = baseSchema.omit({ id: true });
export const insertUserParams = baseSchema.extend({}).omit({ 
  id: true
});

export const updateUserSchema = baseSchema;
export const updateUserParams = updateUserSchema.extend({})
export const userIdSchema = baseSchema.pick({ id: true });

// Types for users - used to type API request params and within Components
export type User = z.infer<typeof userSchema>;
export type NewUser = z.infer<typeof insertUserSchema>;
export type NewUserParams = z.infer<typeof insertUserParams>;
export type UpdateUserParams = z.infer<typeof updateUserParams>;
export type UserId = z.infer<typeof userIdSchema>["id"];
    
// this type infers the return from getUsers() - meaning it will include any joins
export type CompleteUser = Awaited<ReturnType<typeof getUsers>>["users"][number];

