import { db } from "@/lib/db/index";
import { type WorkflowId, workflowIdSchema } from "@/lib/db/schema/workflows";

export const getWorkflows = async () => {
  const w = await db.workflow.findMany({include: { User: true}});
  return { workflows: w };
};

export const getWorkflowById = async (id: WorkflowId) => {
  const { id: workflowId } = workflowIdSchema.parse({ id });
  const w = await db.workflow.findFirst({
    where: { id: workflowId},
    include: { User: true }
  });
  return { workflow: w };
};


