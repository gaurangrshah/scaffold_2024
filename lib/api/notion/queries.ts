import { db } from "@/lib/db/index";
import { type NotionId, notionIdSchema } from "@/lib/db/schema/notion";

export const getNotions = async () => {
  const n = await db.notion.findMany({include: { Connection: true}});
  return { notion: n };
};

export const getNotionById = async (id: NotionId) => {
  const { id: notionId } = notionIdSchema.parse({ id });
  const n = await db.notion.findFirst({
    where: { id: notionId},
    include: { Connection: true }
  });
  return { notion: n };
};


