import { notionSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { getNotions } from "@/lib/api/notion/queries";


// Schema for notion - used to validate API requests
const baseSchema = notionSchema

export const insertNotionSchema = baseSchema.omit({ id: true });
export const insertNotionParams = baseSchema.extend({
  connectionId: z.coerce.string().min(1)
}).omit({ 
  id: true
});

export const updateNotionSchema = baseSchema;
export const updateNotionParams = updateNotionSchema.extend({
  connectionId: z.coerce.string().min(1)
})
export const notionIdSchema = baseSchema.pick({ id: true });

// Types for notion - used to type API request params and within Components
export type Notion = z.infer<typeof notionSchema>;
export type NewNotion = z.infer<typeof insertNotionSchema>;
export type NewNotionParams = z.infer<typeof insertNotionParams>;
export type UpdateNotionParams = z.infer<typeof updateNotionParams>;
export type NotionId = z.infer<typeof notionIdSchema>["id"];
    
// this type infers the return from getNotion() - meaning it will include any joins
export type CompleteNotion = Awaited<ReturnType<typeof getNotions>>["notion"][number];

