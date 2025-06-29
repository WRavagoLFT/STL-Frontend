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

    // Conditionally fetch operators
    if (roleKey !== "kabo" && roleKey !== "kubrador") {
      try {
        const operatorRes = await fetchOperators();
        setOperatorMap(operatorRes.data);
      } catch (err) {
        console.warn("[loadUsers] Skipped Operator fetch due to permissions.");
      }

      // Conditionally fetch PCSO branches
      try {
        const pcsoBranchRes = await fetchPCSOBranch();
        setPscoBranchMap(pcsoBranchRes);
      } catch (err) {
        console.warn("[loadUsers] Skipped PCSO branch fetch due to permissions.");
      }
    }

  } catch (error) {
    console.error("Error in loadUsers:", (error as Error).message);
    setData([]);
  } finally {
    setLoading(false);
  }
};




