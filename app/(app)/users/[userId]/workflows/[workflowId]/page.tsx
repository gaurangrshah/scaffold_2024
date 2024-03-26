import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getWorkflowById } from "@/lib/api/workflows/queries";
import { getUsers } from "@/lib/api/users/queries";import OptimisticWorkflow from "@/app/(app)/workflows/[workflowId]/OptimisticWorkflow";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function WorkflowPage({
  params,
}: {
  params: { workflowId: string };
}) {

  return (
    <main className="overflow-auto">
      <Workflow id={params.workflowId} />
    </main>
  );
}

const Workflow = async ({ id }: { id: string }) => {
  
  const { workflow } = await getWorkflowById(id);
  const { users } = await getUsers();

  if (!workflow) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="workflows" />
        <OptimisticWorkflow workflow={workflow} users={users}
        userId={workflow.userId} />
      </div>
    </Suspense>
  );
};
