import { slackSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { getSlacks } from "@/lib/api/slack/queries";


// Schema for slack - used to validate API requests
const baseSchema = slackSchema

export const insertSlackSchema = baseSchema.omit({ id: true });
export const insertSlackParams = baseSchema.extend({
  connectionId: z.coerce.string().min(1)
}).omit({ 
  id: true
});

export const updateSlackSchema = baseSchema;
export const updateSlackParams = updateSlackSchema.extend({
  connectionId: z.coerce.string().min(1)
})
export const slackIdSchema = baseSchema.pick({ id: true });

// Types for slack - used to type API request params and within Components
export type Slack = z.infer<typeof slackSchema>;
export type NewSlack = z.infer<typeof insertSlackSchema>;
export type NewSlackParams = z.infer<typeof insertSlackParams>;
export type UpdateSlackParams = z.infer<typeof updateSlackParams>;
export type SlackId = z.infer<typeof slackIdSchema>["id"];
    
// this type infers the return from getSlack() - meaning it will include any joins
export type CompleteSlack = Awaited<ReturnType<typeof getSlacks>>["slack"][number];

