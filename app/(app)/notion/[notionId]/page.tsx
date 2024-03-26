import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getNotionById } from "@/lib/api/notion/queries";
import { getConnections } from "@/lib/api/connections/queries";import OptimisticNotion from "@/app/(app)/notion/[notionId]/OptimisticNotion";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function NotionPage({
  params,
}: {
  params: { notionId: string };
}) {

  return (
    <main className="overflow-auto">
      <Notion id={params.notionId} />
    </main>
  );
}

const Notion = async ({ id }: { id: string }) => {
  
  const { notion } = await getNotionById(id);
  const { connections } = await getConnections();

  if (!notion) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="notion" />
        <OptimisticNotion notion={notion} connections={connections} />
      </div>
    </Suspense>
  );
};
