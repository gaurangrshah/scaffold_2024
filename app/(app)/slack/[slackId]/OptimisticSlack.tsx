"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/slack/useOptimisticSlack";
import { type Slack } from "@/lib/db/schema/slack";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import SlackForm from "@/components/slack/SlackForm";
import { type Connection, type ConnectionId } from "@/lib/db/schema/connections";

export default function OptimisticSlack({ 
  slack,
  connections,
  connectionId 
}: { 
  slack: Slack; 
  
  connections: Connection[];
  connectionId?: ConnectionId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Slack) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticSlack, setOptimisticSlack] = useOptimistic(slack);
  const updateSlack: TAddOptimistic = (input) =>
    setOptimisticSlack({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <SlackForm
          slack={optimisticSlack}
          connections={connections}
        connectionId={connectionId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateSlack}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticSlack.appId}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticSlack.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticSlack, null, 2)}
      </pre>
    </div>
  );
}
