import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/router";
import useUserRoleStore from "~/store/useUserStore";
import { handleUpdateUser } from "~/hooks/handleUpdateUserAction";
import DetailedTable from "~/components/ui/tables/DetailedTable";
const ChartsDataPage = React.lazy(() => import("~/components/ui/charts/UserChartsData"));
const CardsPage = React.lazy(() => import("~/components/user/CardsData"));
import AddUserModal from "~/components/user/AddUser";
import UpdateUserModal from "~/components/user/UpdateUser";
import EditModalPage from "~/components/ui/modals/EditLogModalWrapper";
import { AccessGuard } from "~/components/auth/AccessGuard";
import { userTableColumns } from "~/config/userTableColumns";
import { userEditColumns } from "~/config/userEditLogTableColumns";
import { User } from "~/types/types";
import { addUser, editLogUser, suspendUser, updateUser } from "~/utils/api/users";
import Swal from "sweetalert2";
import { loadUsers } from "~/hooks/useLoadUsers";
import { useAuthStore } from "~/store/useAuthStore";
import { UsersSkeletonPage } from "~/components/user/UsersSkeleton";

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
    permittedUserTypes: [3, 4],
  },
  kabo: {
    label: "Kabo",
    textlabel: "Kabo",
    roleId: 2,
    permittedUserTypes: [3, 4, 5  ],
  },
  executive: {
    label: "Small Town Lottery Executive",
    textlabel: "Executives",
    roleId: 5,
    permittedUserTypes: [6],
  },
  managers: {
    label: "Small Town Lottery Manager",
    textlabel: "Managers",
    roleId: 4,
    permittedUserTypes: [6],
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
  const currentUserType = useAuthStore((state) => state.userTypeId);
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
  const [loading, setLoading] = useState(true);

  console.log('current user type:', currentUserType);

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
    if (!roleKey) return;

    loadUsers(roleConfig, roleKey, setData, setKaboMap, setOperatorMap, setPscoBranchMap, setLoading);
  }, [roleConfig, roleKey]);

  //console.log("DATA USER", data);
  // console.log("operatormappp", operatorMap);
  //console.log('ROLE CONFIG IN THE PAGE:', roleConfig);

  const handleAddUser = async (data: User): Promise<void> => {
    try {
      console.log("Adding user:", data);
      const result = await addUser(data);

      if (result.success) {
        console.log("User added successfully:", result.data);

        if (roleKey) {
          await loadUsers(roleConfig, roleKey, setData, setKaboMap, setOperatorMap, setPscoBranchMap, setLoading);
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
      () => loadUsers(roleConfig, roleKey!, setData, setKaboMap, setOperatorMap, setPscoBranchMap, setLoading),
      () => setIsCreateModalOpen(false)
    );
  };

  const handleSuspendUser = async (data: User & { remarks?: string }): Promise<void> => {
    try {
      const userId = data?.UserId;

      if (!userId) {
        throw new Error("User ID is missing.");
      }

      const result = await suspendUser(userId, data.remarks);

      if (result.success) {
        console.log("User suspended successfully:", result.data);

        if (roleKey) {
          await loadUsers(roleConfig, roleKey, setData, setKaboMap, setOperatorMap, setPscoBranchMap, setLoading);
        }

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "User suspended successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        console.error("Failed to suspend user:", result.message);
        Swal.fire({
          icon: "error",
          title: "Suspend Failed",
          text: result.message || "Something went wrong while suspending the user.",
        });
      }
    } catch (error) {
      console.error("Unexpected error in handleSuspendUser:", (error as Error).message);
      Swal.fire({
        icon: "error",
        title: "Unexpected Error",
        text: (error as Error).message || "An unexpected error occurred.",
      });
    } finally {
      setIsCreateModalOpen(false);
    }
  };

  return (
    <AccessGuard allowedUserTypes={roleConfig.permittedUserTypes}>
      {loading ? (
        <UsersSkeletonPage />
      ) : (
        <Suspense fallback={<UsersSkeletonPage />}>
          <div className="mx-auto px-0 py-1">
            <h1 className="text-3xl font-bold mb-3">{label}</h1>
            <CardsPage
              dashboardData={data}
              roleLabel={label}
              textlabel={textlabel}
            />

            {currentUserType !== 3 ? (
              <ChartsDataPage pageType={roleKey} dashboardData={data} />
            ) : (
              <div className="my-4" /> 
            )}

            <DetailedTable<User>
              data={data}
              columns={tableColumns}
              pageType={roleKey}
              operatorMap={operatorMap}
              roleId={roleId}
              statsPerRegion={data}
              source="users"
              onAddClick={openCreateModal}
              onUpdateClick={openUpdateModal}
              onSubmit={handleSuspendUser}
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
      </Suspense>
      )}
    </AccessGuard>
  );
};

export default RolePage;
