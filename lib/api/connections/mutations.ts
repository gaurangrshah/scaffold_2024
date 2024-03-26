import { db } from "@/lib/db/index";
import { 
  ConnectionId, 
  NewConnectionParams,
  UpdateConnectionParams, 
  updateConnectionSchema,
  insertConnectionSchema, 
  connectionIdSchema 
} from "@/lib/db/schema/connections";

export const createConnection = async (connection: NewConnectionParams) => {
  const newConnection = insertConnectionSchema.parse(connection);
  try {
    const c = await db.connection.create({ data: newConnection });
    return { connection: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateConnection = async (id: ConnectionId, connection: UpdateConnectionParams) => {
  const { id: connectionId } = connectionIdSchema.parse({ id });
  const newConnection = updateConnectionSchema.parse(connection);
  try {
    const c = await db.connection.update({ where: { id: connectionId }, data: newConnection})
    return { connection: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteConnection = async (id: ConnectionId) => {
  const { id: connectionId } = connectionIdSchema.parse({ id });
  try {
    const c = await db.connection.delete({ where: { id: connectionId }})
    return { connection: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

