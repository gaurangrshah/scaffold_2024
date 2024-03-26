import { type Connection } from "@/lib/db/schema/connections";
import { type Slack, type CompleteSlack } from "@/lib/db/schema/slack";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Slack>) => void;

export const useOptimisticSlacks = (
  slack: CompleteSlack[],
  connections: Connection[]
) => {
  const [optimisticSlacks, addOptimisticSlack] = useOptimistic(
    slack,
    (
      currentState: CompleteSlack[],
      action: OptimisticAction<Slack>,
    ): CompleteSlack[] => {
      const { data } = action;

      const optimisticConnection = connections.find(
        (connection) => connection.id === data.connectionId,
      )!;

      const optimisticSlack = {
        ...data,
        connection: optimisticConnection,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticSlack]
            : [...currentState, optimisticSlack];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticSlack } : item,
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

  return { addOptimisticSlack, optimisticSlacks };
};
