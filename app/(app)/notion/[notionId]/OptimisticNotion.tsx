"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/notion/useOptimisticNotion";
import { type Notion } from "@/lib/db/schema/notion";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import NotionForm from "@/components/notion/NotionForm";
import { type Connection, type ConnectionId } from "@/lib/db/schema/connections";

export default function OptimisticNotion({ 
  notion,
  connections,
  connectionId 
}: { 
  notion: Notion; 
  
  connections: Connection[];
  connectionId?: ConnectionId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Notion) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticNotion, setOptimisticNotion] = useOptimistic(notion);
  const updateNotion: TAddOptimistic = (input) =>
    setOptimisticNotion({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <NotionForm
          notion={optimisticNotion}
          connections={connections}
        connectionId={connectionId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateNotion}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticNotion.accessToken}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticNotion.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticNotion, null, 2)}
      </pre>
    </div>
  );
}
