"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Workflow, CompleteWorkflow } from "@/lib/db/schema/workflows";
import Modal from "@/components/shared/Modal";
import { type User, type UserId } from "@/lib/db/schema/users";
import { useOptimisticWorkflows } from "@/app/(app)/workflows/useOptimisticWorkflows";
import { Button } from "@/components/ui/button";
import WorkflowForm from "./WorkflowForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (workflow?: Workflow) => void;

export default function WorkflowList({
  workflows,
  users,
  userId 
}: {
  workflows: CompleteWorkflow[];
  users: User[];
  userId?: UserId 
}) {
  const { optimisticWorkflows, addOptimisticWorkflow } = useOptimisticWorkflows(
    workflows,
    users 
  );
  const [open, setOpen] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState<Workflow | null>(null);
  const openModal = (workflow?: Workflow) => {
    setOpen(true);
    workflow ? setActiveWorkflow(workflow) : setActiveWorkflow(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeWorkflow ? "Edit Workflow" : "Create Workflow"}
      >
        <WorkflowForm
          workflow={activeWorkflow}
          addOptimistic={addOptimisticWorkflow}
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
      {optimisticWorkflows.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticWorkflows.map((workflow) => (
            <Workflow
              workflow={workflow}
              key={workflow.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Workflow = ({
  workflow,
  openModal,
}: {
  workflow: CompleteWorkflow;
  openModal: TOpenModal;
}) => {
  const optimistic = workflow.id === "optimistic";
  const deleting = workflow.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("workflows")
    ? pathname
    : pathname + "/workflows/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{workflow.nodes}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + workflow.id }>
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
        No workflows
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new workflow.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Workflows </Button>
      </div>
    </div>
  );
};
