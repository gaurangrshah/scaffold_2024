import { db } from "@/lib/db/index";
import { 
  LocalGoogleCredentialId, 
  NewLocalGoogleCredentialParams,
  UpdateLocalGoogleCredentialParams, 
  updateLocalGoogleCredentialSchema,
  insertLocalGoogleCredentialSchema, 
  localGoogleCredentialIdSchema 
} from "@/lib/db/schema/localGoogleCredential";

export const createLocalGoogleCredential = async (localGoogleCredential: NewLocalGoogleCredentialParams) => {
  const newLocalGoogleCredential = insertLocalGoogleCredentialSchema.parse(localGoogleCredential);
  try {
    const l = await db.localGoogleCredential.create({ data: newLocalGoogleCredential });
    return { localGoogleCredential: l };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateLocalGoogleCredential = async (id: LocalGoogleCredentialId, localGoogleCredential: UpdateLocalGoogleCredentialParams) => {
  const { id: localGoogleCredentialId } = localGoogleCredentialIdSchema.parse({ id });
  const newLocalGoogleCredential = updateLocalGoogleCredentialSchema.parse(localGoogleCredential);
  try {
    const l = await db.localGoogleCredential.update({ where: { id: localGoogleCredentialId }, data: newLocalGoogleCredential})
    return { localGoogleCredential: l };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteLocalGoogleCredential = async (id: LocalGoogleCredentialId) => {
  const { id: localGoogleCredentialId } = localGoogleCredentialIdSchema.parse({ id });
  try {
    const l = await db.localGoogleCredential.delete({ where: { id: localGoogleCredentialId }})
    return { localGoogleCredential: l };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

