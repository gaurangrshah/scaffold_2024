import { db } from "@/lib/db/index";
import { 
  WorkflowId, 
  NewWorkflowParams,
  UpdateWorkflowParams, 
  updateWorkflowSchema,
  insertWorkflowSchema, 
  workflowIdSchema 
} from "@/lib/db/schema/workflows";

export const createWorkflow = async (workflow: NewWorkflowParams) => {
  const newWorkflow = insertWorkflowSchema.parse(workflow);
  try {
    const w = await db.workflow.create({ data: newWorkflow });
    return { workflow: w };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateWorkflow = async (id: WorkflowId, workflow: UpdateWorkflowParams) => {
  const { id: workflowId } = workflowIdSchema.parse({ id });
  const newWorkflow = updateWorkflowSchema.parse(workflow);
  try {
    const w = await db.workflow.update({ where: { id: workflowId }, data: newWorkflow})
    return { workflow: w };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteWorkflow = async (id: WorkflowId) => {
  const { id: workflowId } = workflowIdSchema.parse({ id });
  try {
    const w = await db.workflow.delete({ where: { id: workflowId }})
    return { workflow: w };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

