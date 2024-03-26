import { db } from "@/lib/db/index";
import { type SlackId, slackIdSchema } from "@/lib/db/schema/slack";

export const getSlacks = async () => {
  const s = await db.slack.findMany({include: { Connection: true}});
  return { slack: s };
};

export const getSlackById = async (id: SlackId) => {
  const { id: slackId } = slackIdSchema.parse({ id });
  const s = await db.slack.findFirst({
    where: { id: slackId},
    include: { Connection: true }
  });
  return { slack: s };
};


