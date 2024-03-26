import { type User } from "@/lib/db/schema/users";
import { type Connection, type CompleteConnection } from "@/lib/db/schema/connections";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Connection>) => void;

export const useOptimisticConnections = (
  connections: CompleteConnection[],
  users: User[]
) => {
  const [optimisticConnections, addOptimisticConnection] = useOptimistic(
    connections,
    (
      currentState: CompleteConnection[],
      action: OptimisticAction<Connection>,
    ): CompleteConnection[] => {
      const { data } = action;

      const optimisticUser = users.find(
        (user) => user.id === data.userId,
      )!;

      const optimisticConnection = {
        ...data,
        user: optimisticUser,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticConnection]
            : [...currentState, optimisticConnection];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticConnection } : item,
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

  return { addOptimisticConnection, optimisticConnections };
};
