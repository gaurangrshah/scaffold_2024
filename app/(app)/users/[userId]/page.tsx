import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getUserByIdWithConnectionsAndWorkflowsAndLocalGoogleCredential } from "@/lib/api/users/queries";
import OptimisticUser from "./OptimisticUser";
import ConnectionList from "@/components/connections/ConnectionList";
import WorkflowList from "@/components/workflows/WorkflowList";
import LocalGoogleCredentialList from "@/components/localGoogleCredential/LocalGoogleCredentialList";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function UserPage({
  params,
}: {
  params: { userId: string };
}) {

  return (
    <main className="overflow-auto">
      <User id={params.userId} />
    </main>
  );
}

const User = async ({ id }: { id: string }) => {
  
  const { user, connections, workflows, localGoogleCredential } = await getUserByIdWithConnectionsAndWorkflowsAndLocalGoogleCredential(id);
  

  if (!user) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="users" />
        <OptimisticUser user={user}  />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">{user.clerkId}&apos;s Connections</h3>
        <ConnectionList
          users={[]}
          userId={user.id}
          connections={connections}
        />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">{user.clerkId}&apos;s Workflows</h3>
        <WorkflowList
          users={[]}
          userId={user.id}
          workflows={workflows}
        />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">{user.clerkId}&apos;s Local Google Credential</h3>
        <LocalGoogleCredentialList
          users={[]}
          userId={user.id}
          localGoogleCredential={localGoogleCredential}
        />
      </div>
    </Suspense>
  );
};
