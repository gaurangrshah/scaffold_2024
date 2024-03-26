import { workflowSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { getWorkflows } from "@/lib/api/workflows/queries";


// Schema for workflows - used to validate API requests
const baseSchema = workflowSchema

export const insertWorkflowSchema = baseSchema.omit({ id: true });
export const insertWorkflowParams = baseSchema.extend({
  publish: z.coerce.boolean(),
  userId: z.coerce.string().min(1)
}).omit({ 
  id: true
});

export const updateWorkflowSchema = baseSchema;
export const updateWorkflowParams = updateWorkflowSchema.extend({
  publish: z.coerce.boolean(),
  userId: z.coerce.string().min(1)
})
export const workflowIdSchema = baseSchema.pick({ id: true });

// Types for workflows - used to type API request params and within Components
export type Workflow = z.infer<typeof workflowSchema>;
export type NewWorkflow = z.infer<typeof insertWorkflowSchema>;
export type NewWorkflowParams = z.infer<typeof insertWorkflowParams>;
export type UpdateWorkflowParams = z.infer<typeof updateWorkflowParams>;
export type WorkflowId = z.infer<typeof workflowIdSchema>["id"];
    
// this type infers the return from getWorkflows() - meaning it will include any joins
export type CompleteWorkflow = Awaited<ReturnType<typeof getWorkflows>>["workflows"][number];

