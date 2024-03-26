import { db } from "@/lib/db/index";
import { 
  NotionId, 
  NewNotionParams,
  UpdateNotionParams, 
  updateNotionSchema,
  insertNotionSchema, 
  notionIdSchema 
} from "@/lib/db/schema/notion";

export const createNotion = async (notion: NewNotionParams) => {
  const newNotion = insertNotionSchema.parse(notion);
  try {
    const n = await db.notion.create({ data: newNotion });
    return { notion: n };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateNotion = async (id: NotionId, notion: UpdateNotionParams) => {
  const { id: notionId } = notionIdSchema.parse({ id });
  const newNotion = updateNotionSchema.parse(notion);
  try {
    const n = await db.notion.update({ where: { id: notionId }, data: newNotion})
    return { notion: n };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteNotion = async (id: NotionId) => {
  const { id: notionId } = notionIdSchema.parse({ id });
  try {
    const n = await db.notion.delete({ where: { id: notionId }})
    return { notion: n };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

