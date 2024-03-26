import * as z from "zod"
import { CompleteUser, relatedUserSchema } from "./index"

export const workflowSchema = z.object({
  id: z.string(),
  nodes: z.string().nullish(),
  edges: z.string().nullish(),
  name: z.string(),
  discordTemplate: z.string().nullish(),
  notionTemplate: z.string().nullish(),
  slackTemplate: z.string().nullish(),
  slackChannels: z.string().array(),
  slackAccessToken: z.string().nullish(),
  notionAccessToken: z.string().nullish(),
  notionDbId: z.string().nullish(),
  flowPath: z.string().nullish(),
  cronPath: z.string().nullish(),
  publish: z.boolean().nullish(),
  description: z.string(),
  userId: z.string(),
})

export interface CompleteWorkflow extends z.infer<typeof workflowSchema> {
  User: CompleteUser
}

/**
 * relatedWorkflowSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedWorkflowSchema: z.ZodSchema<CompleteWorkflow> = z.lazy(() => workflowSchema.extend({
  User: relatedUserSchema,
}))
