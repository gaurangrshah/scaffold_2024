"use server";

import { revalidatePath } from "next/cache";
import {
  createWorkflow,
  deleteWorkflow,
  updateWorkflow,
} from "@/lib/api/workflows/mutations";
import {
  WorkflowId,
  NewWorkflowParams,
  UpdateWorkflowParams,
  workflowIdSchema,
  insertWorkflowParams,
  updateWorkflowParams,
} from "@/lib/db/schema/workflows";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateWorkflows = () => revalidatePath("/workflows");

export const createWorkflowAction = async (input: NewWorkflowParams) => {
  try {
    const payload = insertWorkflowParams.parse(input);
    await createWorkflow(payload);
    revalidateWorkflows();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateWorkflowAction = async (input: UpdateWorkflowParams) => {
  try {
    const payload = updateWorkflowParams.parse(input);
    await updateWorkflow(payload.id, payload);
    revalidateWorkflows();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteWorkflowAction = async (input: WorkflowId) => {
  try {
    const payload = workflowIdSchema.parse({ id: input });
    await deleteWorkflow(payload.id);
    revalidateWorkflows();
  } catch (e) {
    return handleErrors(e);
  }
};