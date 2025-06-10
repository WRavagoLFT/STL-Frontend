// React & Next
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Stores & Hooks
import useUserRoleStore from "~/store/useUserStore";
import { handleUpdateUser } from "~/hooks/handleUpdateUserAction";

// Components
import DetailedTable from "~/components/ui/tables/DetailedTable";
import ChartsDataPage from "~/components/ui/charts/UserChartsData";
import CardsPage from "~/components/user/CardsData";
import AddUserModal from "~/components/user/AddUser";
import UpdateUserModal from "~/components/user/UpdateUser";
import EditModalPage from "~/components/ui/modals/EditLogModalWrapper";
import { AccessGuard } from "~/components/auth/AccessGuard";

// Configs & Types
import { userTableColumns } from "~/config/userTableColumns";
import { userEditColumns } from "~/config/userEditLogTableColumns";
import { User } from "~/types/types";

// Utils
import {
  addUser,
  editLogUser
} from "~/utils/api/users";

// Libs
import Swal from "sweetalert2";
import { loadUsers } from "~/hooks/useLoadUsers";

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
    permittedUserTypes: [3, 4, 5  ], // managers, exec, admin
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

  if (!roleConfig) {
    return (
      <div className="container mx-auto px-0 py-1">
        <h1 className="text-2xl font-semibold mb-4">Role not found</h1>
      </div>
    );
  }

  const { roleId, label, textlabel } = roleConfig;
  const operatorMap = useUserRoleStore((state) => state.operatorMap);
  const setOperatorMap = useUserRoleStore((state) => state.setOperatorMap);
  const { data, setData } = useUserRoleStore();
  const tableColumns = userTableColumns(roleId);
  const editLogtableColumns = userEditColumns();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditLog, setShowEditLog] = useState(false);
  const [pcsoBranchMap, setPscoBranchMap] = useState<any>(null);
  const [kaboMap, setKaboMap] = React.useState<User | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  const openEditLogModal = (user: User) => {
    setSelectedUser(user);
    setShowEditLog(true);
  };

  useEffect(() => {
    if (!roleKey) return; // or if (roleKey === undefined) return;

    loadUsers(roleConfig, roleKey, setData, setKaboMap, setOperatorMap, setPscoBranchMap);
  }, [roleConfig, roleKey]);

  // console.log("DATA USER", data);
  // console.log("operatormappp", operatorMap);
  //console.log('ROLE CONFIG IN THE PAGE:', roleConfig);

  const handleAddUser = async (data: User): Promise<void> => {
    try {
      console.log("Adding user:", data);
      const result = await addUser(data);

      if (result.success) {
        console.log("User added successfully:", result.data);

        if (roleKey) {
          await loadUsers(roleConfig, roleKey, setData, setKaboMap, setOperatorMap, setPscoBranchMap);
        }

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
  
  const onUserUpdateSubmit = async (formData: User) => {
    await handleUpdateUser(
      formData,
      () => loadUsers(roleConfig, roleKey!, setData, setKaboMap, setOperatorMap, setPscoBranchMap),
      () => setIsCreateModalOpen(false)
    );
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

        <ChartsDataPage 
          pageType={roleKey} 
          dashboardData={data} 
        />

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

        {isUpdateModalOpen && (
          <UpdateUserModal
            open={isUpdateModalOpen}
            onClose={closeUpdateModal}
            onSubmit={onUserUpdateSubmit}
            operatorMap={operatorMap}
            userTypeId={roleId}
            selectedUser={selectedUser}
            onViewEditLogs={() => openEditLogModal(selectedUser!)}
          />
        )}

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
