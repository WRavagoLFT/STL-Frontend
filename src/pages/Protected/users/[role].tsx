import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import DetailedTable from "~/components/ui/tables/DetailedTable";
import ChartsDataPage from "~/components/ui/charts/UserChartsData";
import { userTableColumns } from "~/config/userTableColumns";
import useUserRoleStore from "../../../store/useUserStore";
import CardsPage from "~/components/user/CardsData";
import {
  addUser,
  editLogUser,
  fetchOperatorMap,
  fetchUsersByRole,
  updateUser,
} from "~/utils/api/users";
import AddUserModal from "~/components/user/AddUser";
import { User } from "~/types/types";
import UpdateUserModal from "~/components/user/UpdateUser";
import Swal from "sweetalert2";
import EditModalPage from "~/components/ui/modals/EditLogModalWrapper";
import { userEditColumns } from "~/config/userEditLogTableColumns";
import { AccessGuard } from "~/components/auth/AccessGuard";
import { fetchPCSOBranch } from "~/utils/api/location";
import axiosInstance from "~/utils/axiosInstance";

const roleMap: Record<
  string,
  {
    label: string;
    textlabel: string;
    roleId: number;
    permittedUserTypes: number[];
  }
> = {
  kubrador: {
    label: "Kubrador",
    textlabel: "Kubrador",
    roleId: 1,
    permittedUserTypes: [3, 4], // managers, exec, admin
  },
  kabo: {
    label: "Kabo",
    textlabel: "Kabo",
    roleId: 2,
    permittedUserTypes: [3, 4], // managers, exec, admin
  },
  executive: {
    label: "Small Town Lottery Executive",
    textlabel: "Executives",
    roleId: 5, // just adjusted 06/02
    permittedUserTypes: [6], // admin ONLY
  },
  managers: {
    label: "Small Town Lottery Manager",
    textlabel: "Managers",
    roleId: 4,
    permittedUserTypes: [6], // admin ONLY
  },
};

const RolePage = () => {
  const { query } = useRouter();
  const role = query.role as string;

  const roleKey = (() => {
    switch (role?.toLowerCase()) {
      case "manager":
      case "managers":
        return "manager";
      case "executive":
      case "executives":
        return "executive";
      case "kubrador":
        return "kubrador";
      case "kabo":
        return "kabo";
      default:
        return undefined;
    }
  })();

  const roleConfig = roleMap[role?.toLowerCase() || ""];

  const operatorMap = useUserRoleStore((state) => state.operatorMap);
  const setOperatorMap = useUserRoleStore((state) => state.setOperatorMap);
  const { data, setData } = useUserRoleStore();

  const { roleId, label, textlabel } = roleConfig;

  const tableColumns = userTableColumns(roleId);

  const editLogtableColumns = userEditColumns();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };
  const openUpdateModal = (user: User) => {
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  };
  const closeUpdateModal = () => {
    setSelectedUser(null);
    setIsUpdateModalOpen(false);
  };
  const [showEditLog, setShowEditLog] = useState(false);

  const openEditLogModal = (user: User) => {
    setSelectedUser(user);
    setShowEditLog(true);
  };
  const [pcsoBranchMap, setPscoBranchMap] = useState<any>(null);
  const [kaboMap, setKaboMap] = React.useState<User | null>(null);
  //const [kaboMap, setKaboMap] = useState<{ data: User[] }>({ data: [] });

  const loadUsers = useCallback(async () => {
    try {
      if (!roleConfig?.roleId || !roleKey) {
        console.warn("Missing roleId or roleKey");
        return;
      }

      //console.log("Loading users for roleKey:", roleKey, "roleId:", roleConfig.roleId);

      // Special roles that skip operator mapping
      if (roleKey === "kabo") {
        //console.log(`Skipping operator/branch map for ${roleKey}`);
        await fetchUsersByRole(roleConfig.roleId, null, null, setData);
        return;
      }

      if (roleKey === "kubrador") {
        const response = await axiosInstance.get('/users/getUsers?userType=2');
        setKaboMap(response.data);

        await fetchUsersByRole(roleConfig.roleId, null, null, setData);
        return;
      }

      //console.log('KABO MAP', kaboMap);

      //console.log("Fetching operator map...");
      const operatorMap = await fetchOperatorMap();
      if (!operatorMap) {
        console.warn("No operator map found.");
        setData([]);
        return;
      }
      //console.log("Operator map fetched:", operatorMap);
      setOperatorMap(operatorMap);

      //console.log("Fetching PCSO branch map...");
      const pcsoBranchMap = await fetchPCSOBranch();
      if (!pcsoBranchMap) {
        console.warn("No PCSO branch map found.");
        setData([]);
        return;
      }
      //console.log("PCSO branch map fetched:", pcsoBranchMap);
      setPscoBranchMap(pcsoBranchMap);

      //console.log("Fetching users with operator & branch maps...");
      await fetchUsersByRole(
        roleConfig.roleId,
        operatorMap,
        pcsoBranchMap,
        setData
      );
    } catch (error) {
      console.error("Error in loadUsers:", (error as Error).message);
      setData([]);
    }
  }, [roleConfig?.roleId, roleKey, setData]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // console.log("DATA USER", data);
  // console.log("operatormappp", operatorMap);

  if (!roleConfig) {
    return (
      <div className="container mx-auto px-0 py-1">
        <h1 className="text-2xl font-semibold mb-4">Role not found</h1>
      </div>
    );
  }

  const handleAddUser = async (data: User): Promise<void> => {
    try {
      console.log("Adding user:", data);

      const result = await addUser(data);

      if (result.success) {
        console.log("User added successfully:", result.data);
        //await fetchUsers(roleConfig.roleId, setData);

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "User added successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        console.error("Failed to add user:", result.message);
        Swal.fire({
          icon: "error",
          title: "Add Failed",
          text: result.message || "Something went wrong while adding the user.",
        });
      }

      setIsCreateModalOpen(false);
    } catch (error) {
      console.error(
        "Unexpected error in handleAddUser:",
        (error as Error).message
      );
      Swal.fire({
        icon: "error",
        title: "Unexpected Error",
        text: (error as Error).message || "An unexpected error occurred.",
      });
    }
  };

  const handleUpdateUser = async (data: User): Promise<void> => {
    try {
      console.log("Updating user:", data);

      const result = await updateUser(data);

      if (result.success) {
        console.log("User updated successfully:", result.data);
        //await fetchUsers(roleConfig.roleId, setData);

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "User updated successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        console.error("Failed to add user:", result.message);
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          //text: result.message || "Something went wrong while adding the user.",
        });
      }

      setIsCreateModalOpen(false);
    } catch (error) {
      console.error(
        "Unexpected error in handleUpdateUser:",
        (error as Error).message
      );
      Swal.fire({
        icon: "error",
        title: "Unexpected Error",
        text: (error as Error).message || "An unexpected error occurred.",
      });
    }
  };

  return (
    <AccessGuard allowedUserTypes={roleConfig.permittedUserTypes}>
      <div className="mx-auto px-0 py-1">
        <h1 className="text-3xl font-bold mb-3">{label}</h1>
        <CardsPage
          dashboardData={data}
          roleLabel={label}
          textlabel={textlabel}
        />

        <ChartsDataPage pageType={roleKey} dashboardData={data} />

        <DetailedTable
          data={data}
          columns={tableColumns}
          pageType={roleKey}
          operatorMap={operatorMap}
          roleId={roleId}
          statsPerRegion={data}
          source="users"
          onAddClick={openCreateModal}
          onUpdateClick={openUpdateModal}
        />

        <AddUserModal
          open={isCreateModalOpen}
          onClose={closeCreateModal}
          onSubmit={handleAddUser}
          operatorMap={operatorMap}
          userTypeId={roleId}
          pcsoBranchMap={pcsoBranchMap}
          kaboMap={kaboMap}
        />

        <UpdateUserModal
          open={isUpdateModalOpen}
          onClose={closeUpdateModal}
          onSubmit={handleUpdateUser}
          operatorMap={operatorMap}
          userTypeId={roleId}
          selectedUser={selectedUser}
          onViewEditLogs={() => openEditLogModal(selectedUser!)}
        />

        {selectedUser && showEditLog && (
          <EditModalPage
            open={showEditLog}
            id={selectedUser.UserId!}
            fetchData={editLogUser}
            columns={editLogtableColumns}
            onClose={() => setShowEditLog(false)}
            userTypeId={roleId}
            selectedUser={selectedUser}
          />
        )}
      </div>
    </AccessGuard>
  );
};

export default RolePage;
