import { type User } from "@/lib/db/schema/users";
import { type Workflow, type CompleteWorkflow } from "@/lib/db/schema/workflows";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Workflow>) => void;

export const useOptimisticWorkflows = (
  workflows: CompleteWorkflow[],
  users: User[]
) => {
  const [optimisticWorkflows, addOptimisticWorkflow] = useOptimistic(
    workflows,
    (
      currentState: CompleteWorkflow[],
      action: OptimisticAction<Workflow>,
    ): CompleteWorkflow[] => {
      const { data } = action;

      const optimisticUser = users.find(
        (user) => user.id === data.userId,
      )!;

      const optimisticWorkflow = {
        ...data,
        user: optimisticUser,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticWorkflow]
            : [...currentState, optimisticWorkflow];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticWorkflow } : item,
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticWorkflow, optimisticWorkflows };
};
