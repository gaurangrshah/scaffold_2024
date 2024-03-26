import { db } from "@/lib/db/index";
import { 
  DiscordWebhookId, 
  NewDiscordWebhookParams,
  UpdateDiscordWebhookParams, 
  updateDiscordWebhookSchema,
  insertDiscordWebhookSchema, 
  discordWebhookIdSchema 
} from "@/lib/db/schema/discordWebhook";

export const createDiscordWebhook = async (discordWebhook: NewDiscordWebhookParams) => {
  const newDiscordWebhook = insertDiscordWebhookSchema.parse(discordWebhook);
  try {
    const d = await db.discordWebhook.create({ data: newDiscordWebhook });
    return { discordWebhook: d };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateDiscordWebhook = async (id: DiscordWebhookId, discordWebhook: UpdateDiscordWebhookParams) => {
  const { id: discordWebhookId } = discordWebhookIdSchema.parse({ id });
  const newDiscordWebhook = updateDiscordWebhookSchema.parse(discordWebhook);
  try {
    const d = await db.discordWebhook.update({ where: { id: discordWebhookId }, data: newDiscordWebhook})
    return { discordWebhook: d };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteDiscordWebhook = async (id: DiscordWebhookId) => {
  const { id: discordWebhookId } = discordWebhookIdSchema.parse({ id });
  try {
    const d = await db.discordWebhook.delete({ where: { id: discordWebhookId }})
    return { discordWebhook: d };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

