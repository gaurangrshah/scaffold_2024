import { db } from "@/lib/db/index";
import { 
  SlackId, 
  NewSlackParams,
  UpdateSlackParams, 
  updateSlackSchema,
  insertSlackSchema, 
  slackIdSchema 
} from "@/lib/db/schema/slack";

export const createSlack = async (slack: NewSlackParams) => {
  const newSlack = insertSlackSchema.parse(slack);
  try {
    const s = await db.slack.create({ data: newSlack });
    return { slack: s };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateSlack = async (id: SlackId, slack: UpdateSlackParams) => {
  const { id: slackId } = slackIdSchema.parse({ id });
  const newSlack = updateSlackSchema.parse(slack);
  try {
    const s = await db.slack.update({ where: { id: slackId }, data: newSlack})
    return { slack: s };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteSlack = async (id: SlackId) => {
  const { id: slackId } = slackIdSchema.parse({ id });
  try {
    const s = await db.slack.delete({ where: { id: slackId }})
    return { slack: s };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

