import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getDiscordWebhookById } from "@/lib/api/discordWebhook/queries";
import { getConnections } from "@/lib/api/connections/queries";import OptimisticDiscordWebhook from "@/app/(app)/discord-webhook/[discordWebhookId]/OptimisticDiscordWebhook";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function DiscordWebhookPage({
  params,
}: {
  params: { discordWebhookId: string };
}) {

  return (
    <main className="overflow-auto">
      <DiscordWebhook id={params.discordWebhookId} />
    </main>
  );
}

const DiscordWebhook = async ({ id }: { id: string }) => {
  
  const { discordWebhook } = await getDiscordWebhookById(id);
  const { connections } = await getConnections();

  if (!discordWebhook) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="discord-webhook" />
        <OptimisticDiscordWebhook discordWebhook={discordWebhook} connections={connections}
        connectionId={discordWebhook.connectionId} />
      </div>
    </Suspense>
  );
};
