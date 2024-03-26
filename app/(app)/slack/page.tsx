import { Suspense } from "react";

import Loading from "@/app/loading";
import SlackList from "@/components/slack/SlackList";
import { getSlack } from "@/lib/api/slack/queries";
import { getConnections } from "@/lib/api/connections/queries";

export const revalidate = 0;

export default async function SlackPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Slack</h1>
        </div>
        <Slack />
      </div>
    </main>
  );
}

const Slack = async () => {
  
  const { slack } = await getSlack();
  const { connections } = await getConnections();
  return (
    <Suspense fallback={<Loading />}>
      <SlackList slack={slack} connections={connections} />
    </Suspense>
  );
};
