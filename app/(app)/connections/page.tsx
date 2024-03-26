import { Suspense } from "react";

import Loading from "@/app/loading";
import ConnectionList from "@/components/connections/ConnectionList";
import { getConnections } from "@/lib/api/connections/queries";
import { getUsers } from "@/lib/api/users/queries";

export const revalidate = 0;

export default async function ConnectionsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Connections</h1>
        </div>
        <Connections />
      </div>
    </main>
  );
}

const Connections = async () => {
  
  const { connections } = await getConnections();
  const { users } = await getUsers();
  return (
    <Suspense fallback={<Loading />}>
      <ConnectionList connections={connections} users={users} />
    </Suspense>
  );
};
