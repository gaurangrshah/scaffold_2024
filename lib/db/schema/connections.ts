import { connectionSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { getConnections } from "@/lib/api/connections/queries";


// Schema for connections - used to validate API requests
const baseSchema = connectionSchema

export const insertConnectionSchema = baseSchema.omit({ id: true });
export const insertConnectionParams = baseSchema.extend({
  userId: z.coerce.string().min(1)
}).omit({ 
  id: true
});

export const updateConnectionSchema = baseSchema;
export const updateConnectionParams = updateConnectionSchema.extend({
  userId: z.coerce.string().min(1)
})
export const connectionIdSchema = baseSchema.pick({ id: true });

// Types for connections - used to type API request params and within Components
export type Connection = z.infer<typeof connectionSchema>;
export type NewConnection = z.infer<typeof insertConnectionSchema>;
export type NewConnectionParams = z.infer<typeof insertConnectionParams>;
export type UpdateConnectionParams = z.infer<typeof updateConnectionParams>;
export type ConnectionId = z.infer<typeof connectionIdSchema>["id"];
    
// this type infers the return from getConnections() - meaning it will include any joins
export type CompleteConnection = Awaited<ReturnType<typeof getConnections>>["connections"][number];

