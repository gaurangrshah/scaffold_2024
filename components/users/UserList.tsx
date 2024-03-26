"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type User, CompleteUser } from "@/lib/db/schema/users";
import Modal from "@/components/shared/Modal";

import { useOptimisticUsers } from "@/app/(app)/users/useOptimisticUsers";
import { Button } from "@/components/ui/button";
import UserForm from "./UserForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (user?: User) => void;

export default function UserList({
  users,
   
}: {
  users: CompleteUser[];
   
}) {
  const { optimisticUsers, addOptimisticUser } = useOptimisticUsers(
    users,
     
  );
  const [open, setOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const openModal = (user?: User) => {
    setOpen(true);
    user ? setActiveUser(user) : setActiveUser(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeUser ? "Edit User" : "Create User"}
      >
        <UserForm
          user={activeUser}
          addOptimistic={addOptimisticUser}
          openModal={openModal}
          closeModal={closeModal}
          
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticUsers.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticUsers.map((user) => (
            <User
              user={user}
              key={user.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const User = ({
  user,
  openModal,
}: {
  user: CompleteUser;
  openModal: TOpenModal;
}) => {
  const optimistic = user.id === "optimistic";
  const deleting = user.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("users")
    ? pathname
    : pathname + "/users/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{user.clerkId}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + user.id }>
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
        No users
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new user.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Users </Button>
      </div>
    </div>
  );
};
