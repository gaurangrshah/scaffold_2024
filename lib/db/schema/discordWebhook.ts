import { discordWebhookSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { getDiscordWebhooks } from "@/lib/api/discordWebhook/queries";


// Schema for discordWebhook - used to validate API requests
const baseSchema = discordWebhookSchema

export const insertDiscordWebhookSchema = baseSchema.omit({ id: true });
export const insertDiscordWebhookParams = baseSchema.extend({
  connectionId: z.coerce.string().min(1)
}).omit({ 
  id: true
});

export const updateDiscordWebhookSchema = baseSchema;
export const updateDiscordWebhookParams = updateDiscordWebhookSchema.extend({
  connectionId: z.coerce.string().min(1)
})
export const discordWebhookIdSchema = baseSchema.pick({ id: true });

// Types for discordWebhook - used to type API request params and within Components
export type DiscordWebhook = z.infer<typeof discordWebhookSchema>;
export type NewDiscordWebhook = z.infer<typeof insertDiscordWebhookSchema>;
export type NewDiscordWebhookParams = z.infer<typeof insertDiscordWebhookParams>;
export type UpdateDiscordWebhookParams = z.infer<typeof updateDiscordWebhookParams>;
export type DiscordWebhookId = z.infer<typeof discordWebhookIdSchema>["id"];
    
// this type infers the return from getDiscordWebhook() - meaning it will include any joins
export type CompleteDiscordWebhook = Awaited<ReturnType<typeof getDiscordWebhooks>>["discordWebhook"][number];

