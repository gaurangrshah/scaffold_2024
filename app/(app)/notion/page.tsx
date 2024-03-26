import { Suspense } from "react";

import Loading from "@/app/loading";
import NotionList from "@/components/notion/NotionList";
import { getNotion } from "@/lib/api/notion/queries";
import { getConnections } from "@/lib/api/connections/queries";

export const revalidate = 0;

export default async function NotionPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Notion</h1>
        </div>
        <Notion />
      </div>
    </main>
  );
}

const Notion = async () => {
  
  const { notion } = await getNotion();
  const { connections } = await getConnections();
  return (
    <Suspense fallback={<Loading />}>
      <NotionList notion={notion} connections={connections} />
    </Suspense>
  );
};
