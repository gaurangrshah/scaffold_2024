"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/local-google-credential/useOptimisticLocalGoogleCredential";
import { type LocalGoogleCredential } from "@/lib/db/schema/localGoogleCredential";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import LocalGoogleCredentialForm from "@/components/localGoogleCredential/LocalGoogleCredentialForm";
import { type User, type UserId } from "@/lib/db/schema/users";

export default function OptimisticLocalGoogleCredential({ 
  localGoogleCredential,
  users,
  userId 
}: { 
  localGoogleCredential: LocalGoogleCredential; 
  
  users: User[];
  userId?: UserId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: LocalGoogleCredential) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticLocalGoogleCredential, setOptimisticLocalGoogleCredential] = useOptimistic(localGoogleCredential);
  const updateLocalGoogleCredential: TAddOptimistic = (input) =>
    setOptimisticLocalGoogleCredential({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <LocalGoogleCredentialForm
          localGoogleCredential={optimisticLocalGoogleCredential}
          users={users}
        userId={userId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateLocalGoogleCredential}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticLocalGoogleCredential.accessToken}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticLocalGoogleCredential.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticLocalGoogleCredential, null, 2)}
      </pre>
    </div>
  );
}
