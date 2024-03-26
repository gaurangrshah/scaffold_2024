import { Suspense } from "react";

import Loading from "@/app/loading";
import LocalGoogleCredentialList from "@/components/localGoogleCredential/LocalGoogleCredentialList";
import { getLocalGoogleCredential } from "@/lib/api/localGoogleCredential/queries";
import { getUsers } from "@/lib/api/users/queries";

export const revalidate = 0;

export default async function LocalGoogleCredentialPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Local Google Credential</h1>
        </div>
        <LocalGoogleCredential />
      </div>
    </main>
  );
}

const LocalGoogleCredential = async () => {
  
  const { localGoogleCredential } = await getLocalGoogleCredential();
  const { users } = await getUsers();
  return (
    <Suspense fallback={<Loading />}>
      <LocalGoogleCredentialList localGoogleCredential={localGoogleCredential} users={users} />
    </Suspense>
  );
};
