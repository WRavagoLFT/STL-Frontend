import { RoleConfig, User } from "~/types/types";
import { fetchPCSOBranch } from "~/lib/api/location";
import { fetchUsers, UsersItem } from "~/lib/api/users/users.service";

export const loadUsers = async (
  roleConfig: RoleConfig | null | undefined,
  roleKey: string,
  setData: (users: UsersItem[]) => void,
  setKaboMap: (data: any) => void,
  setOperatorMap: (data: any) => void,
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

    // Fetch user list (unified fetch)
    const userResponse = await fetchUsers();
    const users = userResponse.data;
    setData(users);

    // Optional: set kaboMap if needed for kubrador
    if (roleKey === "kubrador") {
      setKaboMap(users.filter(user => user.UserTypeId === 2));
    }

    // Fetch related maps
    const [operatorRes, pcsoBranchRes] = await Promise.all([
      fetchOperatorMap(),
      fetchPCSOBranch()
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


