import { type User } from "@/lib/db/schema/users";
import { type LocalGoogleCredential, type CompleteLocalGoogleCredential } from "@/lib/db/schema/localGoogleCredential";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<LocalGoogleCredential>) => void;

export const useOptimisticLocalGoogleCredentials = (
  localGoogleCredential: CompleteLocalGoogleCredential[],
  users: User[]
) => {
  const [optimisticLocalGoogleCredentials, addOptimisticLocalGoogleCredential] = useOptimistic(
    localGoogleCredential,
    (
      currentState: CompleteLocalGoogleCredential[],
      action: OptimisticAction<LocalGoogleCredential>,
    ): CompleteLocalGoogleCredential[] => {
      const { data } = action;

      const optimisticUser = users.find(
        (user) => user.id === data.userId,
      )!;

      const optimisticLocalGoogleCredential = {
        ...data,
        user: optimisticUser,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticLocalGoogleCredential]
            : [...currentState, optimisticLocalGoogleCredential];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticLocalGoogleCredential } : item,
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

  return { addOptimisticLocalGoogleCredential, optimisticLocalGoogleCredentials };
};
