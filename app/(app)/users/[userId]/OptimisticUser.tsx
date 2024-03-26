"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/users/useOptimisticUsers";
import { type User } from "@/lib/db/schema/users";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import UserForm from "@/components/users/UserForm";


export default function OptimisticUser({ 
  user,
   
}: { 
  user: User; 
  
  
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: User) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticUser, setOptimisticUser] = useOptimistic(user);
  const updateUser: TAddOptimistic = (input) =>
    setOptimisticUser({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <UserForm
          user={optimisticUser}
          
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateUser}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticUser.clerkId}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticUser.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticUser, null, 2)}
      </pre>
    </div>
  );
}
