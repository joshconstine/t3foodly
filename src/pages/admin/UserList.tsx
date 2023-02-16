import { User } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "../../utils/api";

const UserList = (props: { users: User[] }) => {
  const router = useRouter();
  const updateRole = api.user.updateRoleById.useMutation();
  const users = api.user.getAll.useQuery();

  const handleRoleChange = (
    e: React.SyntheticEvent<HTMLButtonElement>,
    userId: string,
    role: String
  ) => {
    e.preventDefault();

    if (role !== "ADMIN") {
      updateRole.mutate(
        {
          role: "ADMIN",
          id: userId,
        },
        {
          onSuccess() {
            users.refetch();
          },
        }
      );
    } else {
      updateRole.mutate(
        {
          role: "USER",
          id: userId,
        },
        {
          onSuccess() {
            users.refetch();
          },
        }
      );
    }
  };
  return (
    <div>
      <h1>User List</h1>
      <table className="table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">User Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {props.users.map((user) => (
            <>
              <tr
                onClick={() => router.push(`/user/${user.id}`)}
                key={user.id}
                className="cursor-pointer"
              >
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.username}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.role}</td>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRoleChange(e, user.id, user.role);
                  }}
                >
                  Toggle role
                </button>
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
