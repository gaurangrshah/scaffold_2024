import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getConnectionByIdWithDiscordWebhookAndSlackAndNotion } from "@/lib/api/connections/queries";
import { getUsers } from "@/lib/api/users/queries";import OptimisticConnection from "@/app/(app)/connections/[connectionId]/OptimisticConnection";
import DiscordWebhookList from "@/components/discordWebhook/DiscordWebhookList";
import SlackList from "@/components/slack/SlackList";
import NotionList from "@/components/notion/NotionList";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function ConnectionPage({
  params,
}: {
  params: { connectionId: string };
}) {

  return (
    <main className="overflow-auto">
      <Connection id={params.connectionId} />
    </main>
  );
}

const Connection = async ({ id }: { id: string }) => {
  
  const { connection, discordWebhook, slack, notion } = await getConnectionByIdWithDiscordWebhookAndSlackAndNotion(id);
  const { users } = await getUsers();

  if (!connection) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="connections" />
        <OptimisticConnection connection={connection} users={users}
        userId={connection.userId} />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">{connection.type}&apos;s Discord Webhook</h3>
        <DiscordWebhookList
          connections={[]}
          connectionId={connection.id}
          discordWebhook={discordWebhook}
        />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">{connection.type}&apos;s Slack</h3>
        <SlackList
          connections={[]}
          connectionId={connection.id}
          slack={slack}
        />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">{connection.type}&apos;s Notion</h3>
        <NotionList
          connections={[]}
          connectionId={connection.id}
          notion={notion}
        />
      </div>
    </Suspense>
  );
};
