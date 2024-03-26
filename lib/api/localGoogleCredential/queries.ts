import { db } from "@/lib/db/index";
import { type LocalGoogleCredentialId, localGoogleCredentialIdSchema } from "@/lib/db/schema/localGoogleCredential";

export const getLocalGoogleCredentials = async () => {
  const l = await db.localGoogleCredential.findMany({include: { User: true}});
  return { localGoogleCredential: l };
};

export const getLocalGoogleCredentialById = async (id: LocalGoogleCredentialId) => {
  const { id: localGoogleCredentialId } = localGoogleCredentialIdSchema.parse({ id });
  const l = await db.localGoogleCredential.findFirst({
    where: { id: localGoogleCredentialId},
    include: { User: true }
  });
  return { localGoogleCredential: l };
};


