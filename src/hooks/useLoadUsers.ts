import { RoleConfig } from "~/types/types";
import { fetchPCSOBranch } from "~/lib/api/location";
import { fetchUsers, UsersItem } from "~/lib/api/users/users.service";
import { fetchOperators, OperatorsItem } from "~/lib/api/operators/operators.service";

export const loadUsers = async (
  roleConfig: RoleConfig | null | undefined,
  roleKey: string,
  setData: (users: UsersItem[]) => void,
  setKaboMap: (data: any) => void,
  setOperatorMap: (data: OperatorsItem[]) => void,
  setPscoBranchMap: (data: any) => void,
  setLoading: (loading: boolean) => void
) => {
  try {
    setLoading(true);

    if (!roleConfig?.roleId || !roleKey) {
      console.warn("Missing roleId or roleKey");
      setData([]);
      return;
    }

    const userResponse = await fetchUsers();
    const allUsers = userResponse.data;

    // Filter users based on the roleId
    const filteredUsers = allUsers
      .filter((user) => user.UserTypeId === roleConfig.roleId)
      .map((user) => ({
        ...user,
        fullName: `${user.FirstName} ${user.LastName}`,
      }));

    setData(filteredUsers);

    if (roleKey === "kubrador") {
      setKaboMap(allUsers.filter((user) => user.UserTypeId === 2));
    }

    const [operatorRes, pcsoBranchRes] = await Promise.all([
      fetchOperators(),
      fetchPCSOBranch(),
    ]);

    setOperatorMap(operatorRes.data);
    setPscoBranchMap(pcsoBranchRes);
  } catch (error) {
    console.error("Error in loadUsers:", (error as Error).message);
    setData([]);
  } finally {
    setLoading(false);
  }
};



