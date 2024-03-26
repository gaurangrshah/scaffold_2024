"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Slack, CompleteSlack } from "@/lib/db/schema/slack";
import Modal from "@/components/shared/Modal";
import { type Connection, type ConnectionId } from "@/lib/db/schema/connections";
import { useOptimisticSlacks } from "@/app/(app)/slack/useOptimisticSlacks";
import { Button } from "@/components/ui/button";
import SlackForm from "./SlackForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (slack?: Slack) => void;

export default function SlackList({
  slack,
  connections,
  connectionId 
}: {
  slack: CompleteSlack[];
  connections: Connection[];
  connectionId?: ConnectionId 
}) {
  const { optimisticSlacks, addOptimisticSlack } = useOptimisticSlacks(
    slack,
    connections 
  );
  const [open, setOpen] = useState(false);
  const [activeSlack, setActiveSlack] = useState<Slack | null>(null);
  const openModal = (slack?: Slack) => {
    setOpen(true);
    slack ? setActiveSlack(slack) : setActiveSlack(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeSlack ? "Edit Slack" : "Create Slack"}
      >
        <SlackForm
          slack={activeSlack}
          addOptimistic={addOptimisticSlack}
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
      {optimisticSlacks.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticSlacks.map((slack) => (
            <Slack
              slack={slack}
              key={slack.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Slack = ({
  slack,
  openModal,
}: {
  slack: CompleteSlack;
  openModal: TOpenModal;
}) => {
  const optimistic = slack.id === "optimistic";
  const deleting = slack.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("slack")
    ? pathname
    : pathname + "/slack/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{slack.appId}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + slack.id }>
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
        No slack
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new slack.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Slack </Button>
      </div>
    </div>
  );
};
