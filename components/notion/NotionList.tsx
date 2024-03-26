"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Notion, CompleteNotion } from "@/lib/db/schema/notion";
import Modal from "@/components/shared/Modal";
import { type Connection, type ConnectionId } from "@/lib/db/schema/connections";
import { useOptimisticNotions } from "@/app/(app)/notion/useOptimisticNotions";
import { Button } from "@/components/ui/button";
import NotionForm from "./NotionForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (notion?: Notion) => void;

export default function NotionList({
  notion,
  connections,
  connectionId 
}: {
  notion: CompleteNotion[];
  connections: Connection[];
  connectionId?: ConnectionId 
}) {
  const { optimisticNotions, addOptimisticNotion } = useOptimisticNotions(
    notion,
    connections 
  );
  const [open, setOpen] = useState(false);
  const [activeNotion, setActiveNotion] = useState<Notion | null>(null);
  const openModal = (notion?: Notion) => {
    setOpen(true);
    notion ? setActiveNotion(notion) : setActiveNotion(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeNotion ? "Edit Notion" : "Create Notion"}
      >
        <NotionForm
          notion={activeNotion}
          addOptimistic={addOptimisticNotion}
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
      {optimisticNotions.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticNotions.map((notion) => (
            <Notion
              notion={notion}
              key={notion.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Notion = ({
  notion,
  openModal,
}: {
  notion: CompleteNotion;
  openModal: TOpenModal;
}) => {
  const optimistic = notion.id === "optimistic";
  const deleting = notion.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("notion")
    ? pathname
    : pathname + "/notion/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{notion.accessToken}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + notion.id }>
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
        No notion
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new notion.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Notion </Button>
      </div>
    </div>
  );
};
