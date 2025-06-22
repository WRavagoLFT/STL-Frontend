import { RoleConfig, User } from "~/types/types";
import { fetchPCSOBranch } from "~/utils/api/location";
import { fetchOperatorMap, fetchUsersByRole } from "~/utils/api/users";
import axiosInstance from "~/utils/axiosInstance";

export const loadUsers = async (
  roleConfig: RoleConfig | null | undefined,
  roleKey: string,
  setData: (users: User[]) => void,
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

    let users: User[] = [];

    if (roleKey === "kabo") {
      const response = await fetchUsersByRole(roleConfig.roleId, null, null);
      users = response.success ? response.data : [];
      setData(users);
      return;
    }

    if (roleKey === "kubrador") {
      const response = await axiosInstance.get("/users/getUsers?userType=2");
      setKaboMap(response.data);

      const result = await fetchUsersByRole(roleConfig.roleId, null, null);
      users = result.success ? result.data : [];
      setData(users);
      return;
    }

    const operatorRes = await fetchOperatorMap();
    setOperatorMap(operatorRes.data);

    const pcsoBranchMap = await fetchPCSOBranch();
    setPscoBranchMap(pcsoBranchMap);

    const result = await fetchUsersByRole(
      roleConfig.roleId,
      operatorRes.data,
      pcsoBranchMap
    );

    users = result.success ? result.data : [];
    setData(users);
  } catch (error) {
    console.error("Error in loadUsers:", (error as Error).message);
    setData([]);
  } finally {
    setLoading(false);
  }
};

