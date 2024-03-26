import { localGoogleCredentialSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getLocalGoogleCredentials } from "@/lib/api/localGoogleCredential/queries";


// Schema for localGoogleCredential - used to validate API requests
const baseSchema = localGoogleCredentialSchema.omit(timestamps)

export const insertLocalGoogleCredentialSchema = baseSchema.omit({ id: true });
export const insertLocalGoogleCredentialParams = baseSchema.extend({
  subscribed: z.coerce.boolean(),
  userId: z.coerce.string().min(1)
}).omit({ 
  id: true
});

export const updateLocalGoogleCredentialSchema = baseSchema;
export const updateLocalGoogleCredentialParams = updateLocalGoogleCredentialSchema.extend({
  subscribed: z.coerce.boolean(),
  userId: z.coerce.string().min(1)
})
export const localGoogleCredentialIdSchema = baseSchema.pick({ id: true });

// Types for localGoogleCredential - used to type API request params and within Components
export type LocalGoogleCredential = z.infer<typeof localGoogleCredentialSchema>;
export type NewLocalGoogleCredential = z.infer<typeof insertLocalGoogleCredentialSchema>;
export type NewLocalGoogleCredentialParams = z.infer<typeof insertLocalGoogleCredentialParams>;
export type UpdateLocalGoogleCredentialParams = z.infer<typeof updateLocalGoogleCredentialParams>;
export type LocalGoogleCredentialId = z.infer<typeof localGoogleCredentialIdSchema>["id"];
    
// this type infers the return from getLocalGoogleCredential() - meaning it will include any joins
export type CompleteLocalGoogleCredential = Awaited<ReturnType<typeof getLocalGoogleCredentials>>["localGoogleCredential"][number];

