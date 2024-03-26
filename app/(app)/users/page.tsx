import { Suspense } from "react";

import Loading from "@/app/loading";
import UserList from "@/components/users/UserList";
import { getUsers } from "@/lib/api/users/queries";


export const revalidate = 0;

export default async function UsersPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Users</h1>
        </div>
        <Users />
      </div>
    </main>
  );
}

const Users = async () => {
  
  const { users } = await getUsers();
  
  return (
    <Suspense fallback={<Loading />}>
      <UserList users={users}  />
    </Suspense>
  );
};
