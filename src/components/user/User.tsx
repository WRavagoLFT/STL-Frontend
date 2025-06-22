"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useUserRoleStore from "~/store/useUserStore";
import { useAuthStore } from "~/store/useAuthStore";
import { handleUpdateUser } from "~/hooks/handleUpdateUserAction";
import { loadUsers } from "~/hooks/useLoadUsers";
import DetailedTable from "~/components/ui/tables/DetailedTable";
import AddUserModal from "~/components/user/AddUser";
import UpdateUserModal from "~/components/user/UpdateUser";
import EditModalPage from "~/components/ui/modals/EditLogModalWrapper";
import { AccessGuard } from "~/components/auth/AccessGuard";
import { UsersSkeletonPage } from "~/components/user/UsersSkeleton";
import { userTableColumns } from "~/config/userTableColumns";
import { userEditColumns } from "~/config/userEditLogTableColumns";
import { addUser, suspendUser, editLogUser } from "~/utils/api/users";
import { User } from "~/types/types";
import Swal from "sweetalert2";

const ChartsDataPage = React.lazy(() => import("~/components/ui/charts/UserChartsData"));
const CardsPage = React.lazy(() => import("~/components/user/CardsData"));

type RoleKey = "kubrador" | "kabo" | "executives" | "managers";

const roleMap: Record<RoleKey, {
  label: string;
  textlabel: string;
  roleId: number;
  permittedUserTypes: number[];
}> = {
  kubrador: { label: "Kubrador", textlabel: "Kubrador", roleId: 1, permittedUserTypes: [3, 4] },
  kabo: { label: "Kabo", textlabel: "Kabo", roleId: 2, permittedUserTypes: [3, 4, 5] },
  executives: { label: "Small Town Lottery Executive", textlabel: "Executives", roleId: 5, permittedUserTypes: [6] },
  managers: { label: "Small Town Lottery Manager", textlabel: "Managers", roleId: 4, permittedUserTypes: [6] },
};

export default function UsersPage() {
  const params = useParams();
  const roleParam = (params?.role as string)?.toLowerCase() as RoleKey;

  const roleConfig = roleMap[roleParam]; 
  const roleKey = roleParam === "managers" ? "manager" : roleParam === "executives" ? "executive" : roleParam; 

  const currentUserType = useAuthStore((state) => state.userTypeId);
  const operatorMap = useUserRoleStore((state) => state.operatorMap);
  const setOperatorMap = useUserRoleStore((state) => state.setOperatorMap);
  const { data, setData } = useUserRoleStore();

  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditLog, setShowEditLog] = useState(false);
  const [kaboMap, setKaboMap] = useState<User | null>(null);
  const [pcsoBranchMap, setPscoBranchMap] = useState<any>(null);

  useEffect(() => {
    if (!roleConfig || !roleKey) return;
    loadUsers(roleConfig, roleKey, setData, setKaboMap, setOperatorMap, setPscoBranchMap, setLoading);
  }, [roleConfig, roleKey]);

  if (!roleConfig) {
    return <div className="p-4 text-lg font-medium">Role not found.</div>;
  }

  const { roleId, label, textlabel, permittedUserTypes } = roleConfig;

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);
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

  const handleAddUser = async (data: User): Promise<void> => {
    try {
      const result = await addUser(data);
      if (result.success) {
        await loadUsers(roleConfig, roleKey!, setData, setKaboMap, setOperatorMap, setPscoBranchMap, setLoading);
        Swal.fire({ icon: "success", title: "User added", timer: 2000, showConfirmButton: false });
        setIsCreateModalOpen(false);
      } else {
        Swal.fire({ icon: "error", title: "Add Failed", text: result.message });
      }
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Unexpected Error", text: err?.message || "An error occurred." });
    }
  };

  const handleSuspendUser = async (data: User & { remarks?: string }) => {
    try {
      if (!data.UserId) throw new Error("Missing UserId");
      const result = await suspendUser(data.UserId, data.remarks);
      if (result.success) {
        await loadUsers(roleConfig, roleKey!, setData, setKaboMap, setOperatorMap, setPscoBranchMap, setLoading);
        Swal.fire({ icon: "success", title: "User suspended", timer: 2000, showConfirmButton: false });
      } else {
        Swal.fire({ icon: "error", title: "Suspend Failed", text: result.message });
      }
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Unexpected Error", text: err?.message || "An error occurred." });
    }
  };

  const handleUpdate = async (formData: User) => {
    await handleUpdateUser(
      formData,
      () => loadUsers(roleConfig, roleKey!, setData, setKaboMap, setOperatorMap, setPscoBranchMap, setLoading),
      () => setIsCreateModalOpen(false)
    );
  };

  return (
    <AccessGuard allowedUserTypes={permittedUserTypes}>
      {loading ? (
        <UsersSkeletonPage />
      ) : (
        <Suspense fallback={<UsersSkeletonPage />}>
          <div className="mx-auto px-0 py-8 md:py-0">
            <h1 className="text-3xl font-bold mb-3">{label}</h1>
            <CardsPage dashboardData={data} roleLabel={label} textlabel={textlabel} />

            {currentUserType !== 3 && (
              <ChartsDataPage pageType={roleKey!} dashboardData={data} />
            )}

            <DetailedTable<User>
              data={data}
              columns={userTableColumns(roleId)}
              pageType={roleKey!}
              roleId={roleId}
              operatorMap={operatorMap}
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

            {isUpdateModalOpen && selectedUser && (
              <UpdateUserModal
                open={isUpdateModalOpen}
                onClose={closeUpdateModal}
                onSubmit={handleUpdate}
                operatorMap={operatorMap}
                userTypeId={roleId}
                selectedUser={selectedUser}
                onViewEditLogs={() => openEditLogModal(selectedUser)}
              />
            )}

            {showEditLog && selectedUser && (
              <EditModalPage
                open={showEditLog}
                id={selectedUser.UserId!}
                fetchData={editLogUser}
                columns={userEditColumns()}
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
}
