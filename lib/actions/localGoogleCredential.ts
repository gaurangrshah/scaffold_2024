"use server";

import { revalidatePath } from "next/cache";
import {
  createLocalGoogleCredential,
  deleteLocalGoogleCredential,
  updateLocalGoogleCredential,
} from "@/lib/api/localGoogleCredential/mutations";
import {
  LocalGoogleCredentialId,
  NewLocalGoogleCredentialParams,
  UpdateLocalGoogleCredentialParams,
  localGoogleCredentialIdSchema,
  insertLocalGoogleCredentialParams,
  updateLocalGoogleCredentialParams,
} from "@/lib/db/schema/localGoogleCredential";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateLocalGoogleCredentials = () => revalidatePath("/local-google-credential");

export const createLocalGoogleCredentialAction = async (input: NewLocalGoogleCredentialParams) => {
  try {
    const payload = insertLocalGoogleCredentialParams.parse(input);
    await createLocalGoogleCredential(payload);
    revalidateLocalGoogleCredentials();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateLocalGoogleCredentialAction = async (input: UpdateLocalGoogleCredentialParams) => {
  try {
    const payload = updateLocalGoogleCredentialParams.parse(input);
    await updateLocalGoogleCredential(payload.id, payload);
    revalidateLocalGoogleCredentials();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteLocalGoogleCredentialAction = async (input: LocalGoogleCredentialId) => {
  try {
    const payload = localGoogleCredentialIdSchema.parse({ id: input });
    await deleteLocalGoogleCredential(payload.id);
    revalidateLocalGoogleCredentials();
  } catch (e) {
    return handleErrors(e);
  }
};