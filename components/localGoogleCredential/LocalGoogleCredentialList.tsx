"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type LocalGoogleCredential, CompleteLocalGoogleCredential } from "@/lib/db/schema/localGoogleCredential";
import Modal from "@/components/shared/Modal";
import { type User, type UserId } from "@/lib/db/schema/users";
import { useOptimisticLocalGoogleCredentials } from "@/app/(app)/local-google-credential/useOptimisticLocalGoogleCredentials";
import { Button } from "@/components/ui/button";
import LocalGoogleCredentialForm from "./LocalGoogleCredentialForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (localGoogleCredential?: LocalGoogleCredential) => void;

export default function LocalGoogleCredentialList({
  localGoogleCredential,
  users,
  userId 
}: {
  localGoogleCredential: CompleteLocalGoogleCredential[];
  users: User[];
  userId?: UserId 
}) {
  const { optimisticLocalGoogleCredentials, addOptimisticLocalGoogleCredential } = useOptimisticLocalGoogleCredentials(
    localGoogleCredential,
    users 
  );
  const [open, setOpen] = useState(false);
  const [activeLocalGoogleCredential, setActiveLocalGoogleCredential] = useState<LocalGoogleCredential | null>(null);
  const openModal = (localGoogleCredential?: LocalGoogleCredential) => {
    setOpen(true);
    localGoogleCredential ? setActiveLocalGoogleCredential(localGoogleCredential) : setActiveLocalGoogleCredential(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeLocalGoogleCredential ? "Edit LocalGoogleCredential" : "Create Local Google Credential"}
      >
        <LocalGoogleCredentialForm
          localGoogleCredential={activeLocalGoogleCredential}
          addOptimistic={addOptimisticLocalGoogleCredential}
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
      {optimisticLocalGoogleCredentials.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticLocalGoogleCredentials.map((localGoogleCredential) => (
            <LocalGoogleCredential
              localGoogleCredential={localGoogleCredential}
              key={localGoogleCredential.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const LocalGoogleCredential = ({
  localGoogleCredential,
  openModal,
}: {
  localGoogleCredential: CompleteLocalGoogleCredential;
  openModal: TOpenModal;
}) => {
  const optimistic = localGoogleCredential.id === "optimistic";
  const deleting = localGoogleCredential.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("local-google-credential")
    ? pathname
    : pathname + "/local-google-credential/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{localGoogleCredential.accessToken}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + localGoogleCredential.id }>
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
        No local google credential
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new local google credential.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Local Google Credential </Button>
      </div>
    </div>
  );
};
