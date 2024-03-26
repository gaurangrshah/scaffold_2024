"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/discord-webhook/useOptimisticDiscordWebhook";
import { type DiscordWebhook } from "@/lib/db/schema/discordWebhook";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import DiscordWebhookForm from "@/components/discordWebhook/DiscordWebhookForm";
import { type Connection, type ConnectionId } from "@/lib/db/schema/connections";

export default function OptimisticDiscordWebhook({ 
  discordWebhook,
  connections,
  connectionId 
}: { 
  discordWebhook: DiscordWebhook; 
  
  connections: Connection[];
  connectionId?: ConnectionId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: DiscordWebhook) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticDiscordWebhook, setOptimisticDiscordWebhook] = useOptimistic(discordWebhook);
  const updateDiscordWebhook: TAddOptimistic = (input) =>
    setOptimisticDiscordWebhook({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <DiscordWebhookForm
          discordWebhook={optimisticDiscordWebhook}
          connections={connections}
        connectionId={connectionId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateDiscordWebhook}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticDiscordWebhook.webhookId}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticDiscordWebhook.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticDiscordWebhook, null, 2)}
      </pre>
    </div>
  );
}
