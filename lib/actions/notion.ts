"use server";

import { revalidatePath } from "next/cache";
import {
  createNotion,
  deleteNotion,
  updateNotion,
} from "@/lib/api/notion/mutations";
import {
  NotionId,
  NewNotionParams,
  UpdateNotionParams,
  notionIdSchema,
  insertNotionParams,
  updateNotionParams,
} from "@/lib/db/schema/notion";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateNotions = () => revalidatePath("/notion");

export const createNotionAction = async (input: NewNotionParams) => {
  try {
    const payload = insertNotionParams.parse(input);
    await createNotion(payload);
    revalidateNotions();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateNotionAction = async (input: UpdateNotionParams) => {
  try {
    const payload = updateNotionParams.parse(input);
    await updateNotion(payload.id, payload);
    revalidateNotions();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteNotionAction = async (input: NotionId) => {
  try {
    const payload = notionIdSchema.parse({ id: input });
    await deleteNotion(payload.id);
    revalidateNotions();
  } catch (e) {
    return handleErrors(e);
  }
};