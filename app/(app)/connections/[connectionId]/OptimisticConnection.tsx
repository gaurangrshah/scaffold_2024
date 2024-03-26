"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/connections/useOptimisticConnections";
import { type Connection } from "@/lib/db/schema/connections";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import ConnectionForm from "@/components/connections/ConnectionForm";
import { type User, type UserId } from "@/lib/db/schema/users";

export default function OptimisticConnection({ 
  connection,
  users,
  userId 
}: { 
  connection: Connection; 
  
  users: User[];
  userId?: UserId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Connection) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticConnection, setOptimisticConnection] = useOptimistic(connection);
  const updateConnection: TAddOptimistic = (input) =>
    setOptimisticConnection({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <ConnectionForm
          connection={optimisticConnection}
          users={users}
        userId={userId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateConnection}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticConnection.type}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticConnection.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticConnection, null, 2)}
      </pre>
    </div>
  );
}
