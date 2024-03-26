"use server";

import { revalidatePath } from "next/cache";
import {
  createDiscordWebhook,
  deleteDiscordWebhook,
  updateDiscordWebhook,
} from "@/lib/api/discordWebhook/mutations";
import {
  DiscordWebhookId,
  NewDiscordWebhookParams,
  UpdateDiscordWebhookParams,
  discordWebhookIdSchema,
  insertDiscordWebhookParams,
  updateDiscordWebhookParams,
} from "@/lib/db/schema/discordWebhook";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateDiscordWebhooks = () => revalidatePath("/discord-webhook");

export const createDiscordWebhookAction = async (input: NewDiscordWebhookParams) => {
  try {
    const payload = insertDiscordWebhookParams.parse(input);
    await createDiscordWebhook(payload);
    revalidateDiscordWebhooks();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateDiscordWebhookAction = async (input: UpdateDiscordWebhookParams) => {
  try {
    const payload = updateDiscordWebhookParams.parse(input);
    await updateDiscordWebhook(payload.id, payload);
    revalidateDiscordWebhooks();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteDiscordWebhookAction = async (input: DiscordWebhookId) => {
  try {
    const payload = discordWebhookIdSchema.parse({ id: input });
    await deleteDiscordWebhook(payload.id);
    revalidateDiscordWebhooks();
  } catch (e) {
    return handleErrors(e);
  }
};