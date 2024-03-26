import * as z from "zod"
import { CompleteUser, relatedUserSchema, CompleteDiscordWebhook, relatedDiscordWebhookSchema, CompleteNotion, relatedNotionSchema, CompleteSlack, relatedSlackSchema } from "./index"

export const connectionSchema = z.object({
  id: z.string(),
  type: z.string(),
  userId: z.string().nullish(),
  discordWebhookId: z.string().nullish(),
  notionId: z.string().nullish(),
  slackId: z.string().nullish(),
})

export interface CompleteConnection extends z.infer<typeof connectionSchema> {
  User?: CompleteUser | null
  DiscordWebhook?: CompleteDiscordWebhook | null
  Notion?: CompleteNotion | null
  Slack?: CompleteSlack | null
}

/**
 * relatedConnectionSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedConnectionSchema: z.ZodSchema<CompleteConnection> = z.lazy(() => connectionSchema.extend({
  User: relatedUserSchema.nullish(),
  DiscordWebhook: relatedDiscordWebhookSchema.nullish(),
  Notion: relatedNotionSchema.nullish(),
  Slack: relatedSlackSchema.nullish(),
}))
