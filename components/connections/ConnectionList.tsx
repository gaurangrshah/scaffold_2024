"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Connection, CompleteConnection } from "@/lib/db/schema/connections";
import Modal from "@/components/shared/Modal";
import { type User, type UserId } from "@/lib/db/schema/users";
import { useOptimisticConnections } from "@/app/(app)/connections/useOptimisticConnections";
import { Button } from "@/components/ui/button";
import ConnectionForm from "./ConnectionForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (connection?: Connection) => void;

export default function ConnectionList({
  connections,
  users,
  userId 
}: {
  connections: CompleteConnection[];
  users: User[];
  userId?: UserId 
}) {
  const { optimisticConnections, addOptimisticConnection } = useOptimisticConnections(
    connections,
    users 
  );
  const [open, setOpen] = useState(false);
  const [activeConnection, setActiveConnection] = useState<Connection | null>(null);
  const openModal = (connection?: Connection) => {
    setOpen(true);
    connection ? setActiveConnection(connection) : setActiveConnection(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeConnection ? "Edit Connection" : "Create Connection"}
      >
        <ConnectionForm
          connection={activeConnection}
          addOptimistic={addOptimisticConnection}
          openModal={openModal}
          closeModal={closeModal}
          users={users}
        userId={userId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticConnections.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticConnections.map((connection) => (
            <Connection
              connection={connection}
              key={connection.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Connection = ({
  connection,
  openModal,
}: {
  connection: CompleteConnection;
  openModal: TOpenModal;
}) => {
  const optimistic = connection.id === "optimistic";
  const deleting = connection.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("connections")
    ? pathname
    : pathname + "/connections/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{connection.type}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + connection.id }>
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
        No connections
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new connection.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Connections </Button>
      </div>
    </div>
  );
};
