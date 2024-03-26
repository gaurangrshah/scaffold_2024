import { type Connection } from "@/lib/db/schema/connections";
import { type DiscordWebhook, type CompleteDiscordWebhook } from "@/lib/db/schema/discordWebhook";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<DiscordWebhook>) => void;

export const useOptimisticDiscordWebhooks = (
  discordWebhook: CompleteDiscordWebhook[],
  connections: Connection[]
) => {
  const [optimisticDiscordWebhooks, addOptimisticDiscordWebhook] = useOptimistic(
    discordWebhook,
    (
      currentState: CompleteDiscordWebhook[],
      action: OptimisticAction<DiscordWebhook>,
    ): CompleteDiscordWebhook[] => {
      const { data } = action;

      const optimisticConnection = connections.find(
        (connection) => connection.id === data.connectionId,
      )!;

      const optimisticDiscordWebhook = {
        ...data,
        connection: optimisticConnection,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticDiscordWebhook]
            : [...currentState, optimisticDiscordWebhook];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticDiscordWebhook } : item,
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

  return { addOptimisticDiscordWebhook, optimisticDiscordWebhooks };
};
