import * as z from "zod"
import { CompleteUser, relatedUserSchema, CompleteConnection, relatedConnectionSchema } from "./index"

export const discordWebhookSchema = z.object({
  id: z.string(),
  webhookId: z.string(),
  url: z.string(),
  name: z.string(),
  guildName: z.string(),
  guildId: z.string(),
  channelId: z.string(),
  userId: z.string(),
})

export interface CompleteDiscordWebhook extends z.infer<typeof discordWebhookSchema> {
  User: CompleteUser
  Connection: CompleteConnection[]
}

/**
 * relatedDiscordWebhookSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedDiscordWebhookSchema: z.ZodSchema<CompleteDiscordWebhook> = z.lazy(() => discordWebhookSchema.extend({
  User: relatedUserSchema,
  Connection: relatedConnectionSchema.array(),
}))
