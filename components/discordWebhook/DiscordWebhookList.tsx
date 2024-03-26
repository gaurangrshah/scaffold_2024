"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type DiscordWebhook, CompleteDiscordWebhook } from "@/lib/db/schema/discordWebhook";
import Modal from "@/components/shared/Modal";
import { type Connection, type ConnectionId } from "@/lib/db/schema/connections";
import { useOptimisticDiscordWebhooks } from "@/app/(app)/discord-webhook/useOptimisticDiscordWebhooks";
import { Button } from "@/components/ui/button";
import DiscordWebhookForm from "./DiscordWebhookForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (discordWebhook?: DiscordWebhook) => void;

export default function DiscordWebhookList({
  discordWebhook,
  connections,
  connectionId 
}: {
  discordWebhook: CompleteDiscordWebhook[];
  connections: Connection[];
  connectionId?: ConnectionId 
}) {
  const { optimisticDiscordWebhooks, addOptimisticDiscordWebhook } = useOptimisticDiscordWebhooks(
    discordWebhook,
    connections 
  );
  const [open, setOpen] = useState(false);
  const [activeDiscordWebhook, setActiveDiscordWebhook] = useState<DiscordWebhook | null>(null);
  const openModal = (discordWebhook?: DiscordWebhook) => {
    setOpen(true);
    discordWebhook ? setActiveDiscordWebhook(discordWebhook) : setActiveDiscordWebhook(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeDiscordWebhook ? "Edit DiscordWebhook" : "Create Discord Webhook"}
      >
        <DiscordWebhookForm
          discordWebhook={activeDiscordWebhook}
          addOptimistic={addOptimisticDiscordWebhook}
          openModal={openModal}
          closeModal={closeModal}
          connections={connections}
        connectionId={connectionId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticDiscordWebhooks.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticDiscordWebhooks.map((discordWebhook) => (
            <DiscordWebhook
              discordWebhook={discordWebhook}
              key={discordWebhook.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const DiscordWebhook = ({
  discordWebhook,
  openModal,
}: {
  discordWebhook: CompleteDiscordWebhook;
  openModal: TOpenModal;
}) => {
  const optimistic = discordWebhook.id === "optimistic";
  const deleting = discordWebhook.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("discord-webhook")
    ? pathname
    : pathname + "/discord-webhook/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{discordWebhook.webhookId}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + discordWebhook.id }>
          Edit
        </Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No discord webhook
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new discord webhook.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Discord Webhook </Button>
      </div>
    </div>
  );
};
