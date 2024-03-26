"use server";

import { revalidatePath } from "next/cache";
import {
  createSlack,
  deleteSlack,
  updateSlack,
} from "@/lib/api/slack/mutations";
import {
  SlackId,
  NewSlackParams,
  UpdateSlackParams,
  slackIdSchema,
  insertSlackParams,
  updateSlackParams,
} from "@/lib/db/schema/slack";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateSlacks = () => revalidatePath("/slack");

export const createSlackAction = async (input: NewSlackParams) => {
  try {
    const payload = insertSlackParams.parse(input);
    await createSlack(payload);
    revalidateSlacks();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateSlackAction = async (input: UpdateSlackParams) => {
  try {
    const payload = updateSlackParams.parse(input);
    await updateSlack(payload.id, payload);
    revalidateSlacks();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteSlackAction = async (input: SlackId) => {
  try {
    const payload = slackIdSchema.parse({ id: input });
    await deleteSlack(payload.id);
    revalidateSlacks();
  } catch (e) {
    return handleErrors(e);
  }
};