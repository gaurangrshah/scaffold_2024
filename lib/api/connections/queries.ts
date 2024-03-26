import { db } from "@/lib/db/index";
import {
  type ConnectionId,
  connectionIdSchema,
} from "@/lib/db/schema/connections";

export const getConnections = async () => {
  const c = await db.connection.findMany({ include: { User: true } });
  return { connections: c };
};

export const getConnectionById = async (id: ConnectionId) => {
  const { id: connectionId } = connectionIdSchema.parse({ id });
  const c = await db.connection.findFirst({
    where: { id: connectionId },
    include: { User: true },
  });
  return { connection: c };
};

export const getConnectionByIdWithDiscordWebhookAndSlackAndNotion = async (
  id: ConnectionId
) => {
  const { id: connectionId } = connectionIdSchema.parse({ id });
  const c = await db.connection.findFirst({
    where: { id: connectionId },
    include: {
      User: { include: { Connections: true } },
      DiscordWebhook: { include: { Connection: true } },
      Slack: { include: { Connection: true } },
      Notion: { include: { Connection: true } },
    },
  });
  if (c === null) return { connection: null };
  const { User, DiscordWebhook, Slack, Notion, ...connection } = c;

  return {
    connection,
    user: User,
    discordWebhook: DiscordWebhook,
    slack: Slack,
    notion: Notion,
  };
};
