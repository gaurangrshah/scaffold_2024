import * as z from "zod"
import { CompleteConnection, relatedConnectionSchema, CompleteWorkflow, relatedWorkflowSchema, CompleteLocalGoogleCredential, relatedLocalGoogleCredentialSchema, CompleteDiscordWebhook, relatedDiscordWebhookSchema, CompleteSlack, relatedSlackSchema, CompleteNotion, relatedNotionSchema } from "./index"

export const userSchema = z.object({
  id: z.number().int(),
  clerkId: z.string(),
  name: z.string().nullish(),
  email: z.string(),
  profileImage: z.string().nullish(),
  tier: z.string().nullish(),
  credits: z.string().nullish(),
  localGoogleId: z.string().nullish(),
  googleResourceId: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteUser extends z.infer<typeof userSchema> {
  Connections: CompleteConnection[]
  Workflows: CompleteWorkflow[]
  LocalGoogleCredential?: CompleteLocalGoogleCredential | null
  DiscordWebhook: CompleteDiscordWebhook[]
  Slack: CompleteSlack[]
  Notion: CompleteNotion[]
}

/**
 * relatedUserSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedUserSchema: z.ZodSchema<CompleteUser> = z.lazy(() => userSchema.extend({
  Connections: relatedConnectionSchema.array(),
  Workflows: relatedWorkflowSchema.array(),
  LocalGoogleCredential: relatedLocalGoogleCredentialSchema.nullish(),
  DiscordWebhook: relatedDiscordWebhookSchema.array(),
  Slack: relatedSlackSchema.array(),
  Notion: relatedNotionSchema.array(),
}))
