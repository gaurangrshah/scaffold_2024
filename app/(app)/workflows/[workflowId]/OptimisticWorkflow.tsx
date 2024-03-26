"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/workflows/useOptimisticWorkflows";
import { type Workflow } from "@/lib/db/schema/workflows";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import WorkflowForm from "@/components/workflows/WorkflowForm";
import { type User, type UserId } from "@/lib/db/schema/users";

export default function OptimisticWorkflow({ 
  workflow,
  users,
  userId 
}: { 
  workflow: Workflow; 
  
  users: User[];
  userId?: UserId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Workflow) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticWorkflow, setOptimisticWorkflow] = useOptimistic(workflow);
  const updateWorkflow: TAddOptimistic = (input) =>
    setOptimisticWorkflow({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <WorkflowForm
          workflow={optimisticWorkflow}
          users={users}
        userId={userId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateWorkflow}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticWorkflow.nodes}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticWorkflow.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticWorkflow, null, 2)}
      </pre>
    </div>
  );
}
