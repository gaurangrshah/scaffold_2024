import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getLocalGoogleCredentialById } from "@/lib/api/localGoogleCredential/queries";
import { getUsers } from "@/lib/api/users/queries";import OptimisticLocalGoogleCredential from "@/app/(app)/local-google-credential/[localGoogleCredentialId]/OptimisticLocalGoogleCredential";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function LocalGoogleCredentialPage({
  params,
}: {
  params: { localGoogleCredentialId: string };
}) {

  return (
    <main className="overflow-auto">
      <LocalGoogleCredential id={params.localGoogleCredentialId} />
    </main>
  );
}

const LocalGoogleCredential = async ({ id }: { id: string }) => {
  
  const { localGoogleCredential } = await getLocalGoogleCredentialById(id);
  const { users } = await getUsers();

  if (!localGoogleCredential) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="local-google-credential" />
        <OptimisticLocalGoogleCredential localGoogleCredential={localGoogleCredential} users={users}
        userId={localGoogleCredential.userId} />
      </div>
    </Suspense>
  );
};
