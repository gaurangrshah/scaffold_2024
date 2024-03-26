import { type Connection } from "@/lib/db/schema/connections";
import { type Notion, type CompleteNotion } from "@/lib/db/schema/notion";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Notion>) => void;

export const useOptimisticNotions = (
  notion: CompleteNotion[],
  connections: Connection[]
) => {
  const [optimisticNotions, addOptimisticNotion] = useOptimistic(
    notion,
    (
      currentState: CompleteNotion[],
      action: OptimisticAction<Notion>,
    ): CompleteNotion[] => {
      const { data } = action;

      const optimisticConnection = connections.find(
        (connection) => connection.id === data.connectionId,
      )!;

      const optimisticNotion = {
        ...data,
        connection: optimisticConnection,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticNotion]
            : [...currentState, optimisticNotion];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticNotion } : item,
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

  return { addOptimisticNotion, optimisticNotions };
};
