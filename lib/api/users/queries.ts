import { db } from "@/lib/db/index";
import { type UserId, userIdSchema } from "@/lib/db/schema/users";

export const getUsers = async () => {
  const u = await db.user.findMany({});
  return { users: u };
};

export const getUserById = async (id: UserId) => {
  const { id: userId } = userIdSchema.parse({ id });
  const u = await db.user.findFirst({
    where: { id: userId },
  });
  return { user: u };
};

export const getUserByIdWithConnectionsAndWorkflowsAndLocalGoogleCredential =
  async (id: UserId) => {
    const { id: userId } = userIdSchema.parse({ id });
    const u = await db.user.findFirst({
      where: { id: userId },
      include: {
        Connection: { include: { User: true } },
        Workflow: { include: { User: true } },
        LocalGoogleCredential: { include: { user: true } },
      },
    });
    if (u === null) return { user: null };
    const { Connection, Workflow, LocalGoogleCredential, ...user } = u;

    return { user, Connection, Workflow, LocalGoogleCredential };
  };
