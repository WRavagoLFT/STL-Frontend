import { RoleConfig } from "@/types/types";
import { fetchPCSOBranch } from "@/lib/api/location";
import { fetchUsers, UsersItem } from "@/lib/api/users/users.service";
import { fetchOperators, OperatorsItem } from "@/lib/api/operators/operators.service";

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

    // Kabo map for Kubrador
    if (roleKey === "kubrador") {
      const kabos = allUsers.filter((user) => user.UserTypeId === 2);
      setKaboMap(kabos);
    }

    // Fetch operators & branches only if not kabo/kubrador
    let enrichedUsers = [...filteredUsers];
    let operatorMap: OperatorsItem[] = [];
    let branchMap: any[] = [];

    if (roleKey !== "kabo" && roleKey !== "kubrador") {
      try {
        const operatorRes = await fetchOperators();
        operatorMap = operatorRes.data || [];
        setOperatorMap(operatorMap);
      } catch (err) {
        console.warn("[loadUsers] Skipped Operator fetch due to permissions.");
      }

      try {
        const branchRes = await fetchPCSOBranch();
        branchMap = branchRes.data || [];
        setPscoBranchMap(branchMap);
      } catch (err) {
        console.warn("[loadUsers] Skipped PCSO branch fetch due to permissions.");
      }

      // Enrich if necessary
      if (roleKey === "executive") {
        enrichedUsers = enrichedUsers.map((user) => ({
          ...user,
          OperatorDetails: operatorMap.find(
            (op) => op.OperatorId === user.OperatorId
          ),
        }));
      }

      if (roleKey === "pcsobranch") {
        enrichedUsers = enrichedUsers.map((user) => ({
          ...user,
          BranchName:
            branchMap.find((br) => br.BranchId === user.BranchId)?.BranchName ||
            "—",
        }));
      }
    }

    setData(enrichedUsers);
  } catch (error) {
    console.error("Error in loadUsers:", (error as Error).message);
    setData([]);
  } finally {
    setLoading(false);
  }
};




