import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getSlackById } from "@/lib/api/slack/queries";
import { getConnections } from "@/lib/api/connections/queries";import OptimisticSlack from "@/app/(app)/slack/[slackId]/OptimisticSlack";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function SlackPage({
  params,
}: {
  params: { slackId: string };
}) {

  return (
    <main className="overflow-auto">
      <Slack id={params.slackId} />
    </main>
  );
}

const Slack = async ({ id }: { id: string }) => {
  
  const { slack } = await getSlackById(id);
  const { connections } = await getConnections();

  if (!slack) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="slack" />
        <OptimisticSlack slack={slack} connections={connections}
        connectionId={slack.connectionId} />
      </div>
    </Suspense>
  );
};
