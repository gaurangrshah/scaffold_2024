import { db } from "@/lib/db/index";
import { type DiscordWebhookId, discordWebhookIdSchema } from "@/lib/db/schema/discordWebhook";

export const getDiscordWebhooks = async () => {
  const d = await db.discordWebhook.findMany({include: { Connection: true}});
  return { discordWebhook: d };
};

export const getDiscordWebhookById = async (id: DiscordWebhookId) => {
  const { id: discordWebhookId } = discordWebhookIdSchema.parse({ id });
  const d = await db.discordWebhook.findFirst({
    where: { id: discordWebhookId},
    include: { Connection: true }
  });
  return { discordWebhook: d };
};


