import { Suspense } from "react";

import Loading from "@/app/loading";
import DiscordWebhookList from "@/components/discordWebhook/DiscordWebhookList";
import { getDiscordWebhook } from "@/lib/api/discordWebhook/queries";
import { getConnections } from "@/lib/api/connections/queries";

export const revalidate = 0;

export default async function DiscordWebhookPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Discord Webhook</h1>
        </div>
        <DiscordWebhook />
      </div>
    </main>
  );
}

const DiscordWebhook = async () => {
  
  const { discordWebhook } = await getDiscordWebhook();
  const { connections } = await getConnections();
  return (
    <Suspense fallback={<Loading />}>
      <DiscordWebhookList discordWebhook={discordWebhook} connections={connections} />
    </Suspense>
  );
};
