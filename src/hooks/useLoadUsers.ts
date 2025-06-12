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
      setLoading(false);
      return;
    }

    if (roleKey === "kabo") {
      await fetchUsersByRole(roleConfig.roleId, null, null, setData);
      setLoading(false);
      return;
    }

    if (roleKey === "kubrador") {
      const response = await axiosInstance.get("/users/getUsers?userType=2");
      setKaboMap(response.data);

      await fetchUsersByRole(roleConfig.roleId, null, null, setData);
      setLoading(false);
      return;
    }

    const operatorMap = await fetchOperatorMap();
    setOperatorMap(operatorMap);

    const pcsoBranchMap = await fetchPCSOBranch();
    setPscoBranchMap(pcsoBranchMap);

    await fetchUsersByRole(
      roleConfig.roleId,
      operatorMap,
      pcsoBranchMap,
      setData
    );
  } catch (error) {
    console.error("Error in loadUsers:", (error as Error).message);
    setData([]);
  } finally {
    setLoading(false);
  }
};
