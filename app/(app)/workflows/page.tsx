import { Suspense } from "react";

import Loading from "@/app/loading";
import WorkflowList from "@/components/workflows/WorkflowList";
import { getWorkflows } from "@/lib/api/workflows/queries";
import { getUsers } from "@/lib/api/users/queries";

export const revalidate = 0;

export default async function WorkflowsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Workflows</h1>
        </div>
        <Workflows />
      </div>
    </main>
  );
}

const Workflows = async () => {
  
  const { workflows } = await getWorkflows();
  const { users } = await getUsers();
  return (
    <Suspense fallback={<Loading />}>
      <WorkflowList workflows={workflows} users={users} />
    </Suspense>
  );
};
