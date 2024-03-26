"use server";

import { revalidatePath } from "next/cache";
import {
  createConnection,
  deleteConnection,
  updateConnection,
} from "@/lib/api/connections/mutations";
import {
  ConnectionId,
  NewConnectionParams,
  UpdateConnectionParams,
  connectionIdSchema,
  insertConnectionParams,
  updateConnectionParams,
} from "@/lib/db/schema/connections";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateConnections = () => revalidatePath("/connections");

export const createConnectionAction = async (input: NewConnectionParams) => {
  try {
    const payload = insertConnectionParams.parse(input);
    await createConnection(payload);
    revalidateConnections();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateConnectionAction = async (input: UpdateConnectionParams) => {
  try {
    const payload = updateConnectionParams.parse(input);
    await updateConnection(payload.id, payload);
    revalidateConnections();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteConnectionAction = async (input: ConnectionId) => {
  try {
    const payload = connectionIdSchema.parse({ id: input });
    await deleteConnection(payload.id);
    revalidateConnections();
  } catch (e) {
    return handleErrors(e);
  }
};