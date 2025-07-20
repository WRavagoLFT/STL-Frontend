"use client";

import React, { useEffect, useState, Suspense, useMemo } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import useUserRoleStore from "@/store/useUserStore";
import { handleUpdateUser } from "@/hooks/handleUpdateUserAction";
import { loadUsers } from "@/hooks/useLoadUsers";
import DetailedTable from "@/components/ui/tables/DetailedTable";
import AddUserModal from "@/components/user/AddUser";
import UpdateUserModal from "@/components/user/UpdateUser";
import EditModalPage from "@/components/ui/modals/EditLogModalWrapper";
import { UsersSkeletonPage } from "@/components/user/UsersSkeleton";
import { userTableColumns } from "@/config/userTableColumns";
import { userEditColumns } from "@/config/userEditLogTableColumns";
import Swal from "sweetalert2";
import { addUsers, AddUserPayload, suspendUser, UsersItem, editLogUser, UpdateUserPayload } from "@/lib/api/users/users.service";
const ChartsDataPage = React.lazy(() => import("@/components/ui/charts/UserChartsData"));
const CardsPage = React.lazy(() => import("@/components/user/CardsData"));

interface UsersPageProps {
  roleConfig: {
    label: string;
    textlabel: string;
    roleId: number;
    permittedUserTypes: number[];
  };
  roleKey:
    | "kubrador"
    | "kabo"
    | "manager"
    | "executive"
    | "operator"
    | "Device Information";
}

export default function UsersPage({ roleConfig, roleKey }: UsersPageProps) {
  const currentUserType = useAuthStore((state) => state.userTypeId);
  const operatorMap = useUserRoleStore((state) => state.operatorMap);
  const setOperatorMap = useUserRoleStore((state) => state.setOperatorMap);
  const { data, setData } = useUserRoleStore();
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UsersItem | null>(null);
  const [showEditLog, setShowEditLog] = useState(false);
  const [kaboMap, setKaboMap] = useState<UsersItem | null>(null);
  const [pcsoBranchMap, setPscoBranchMap] = useState<any>(null);

  useEffect(() => {
    if (!roleConfig || !roleKey) return;
    loadUsers(
      roleConfig,
      roleKey,
      setData,
      setKaboMap,
      setOperatorMap,
      setPscoBranchMap,
      setLoading
    );
  }, [roleConfig, roleKey]);

  const { roleId, label, textlabel } = roleConfig;
  const columns = useMemo(() => userTableColumns(roleId), [roleId]);

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);
  
  const openUpdateModal = (user: UsersItem) => {
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  };
  
  const closeUpdateModal = () => {
    setSelectedUser(null);
    setIsUpdateModalOpen(false);
  };

  const openEditLogModal = (user: UsersItem) => {
    setSelectedUser(user);
    setShowEditLog(true);
  };

  const handleAddUser = async (data: AddUserPayload): Promise<void> => {
    try {
      const result = await addUsers(data);
      if (result.success) {
        await loadUsers(
          roleConfig,
          roleKey,
          setData,
          setKaboMap,
          setOperatorMap,
          setPscoBranchMap,
          setLoading
        );
        Swal.fire({
          icon: "success",
          title: "User added",
          timer: 2000,
          showConfirmButton: false,
        });
        setIsCreateModalOpen(false);
      } else {
        Swal.fire({ icon: "error", title: "Add Failed", text: result.message });
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Unexpected Error",
        text: err?.message || "An error occurred.",
      });
    }
  };

  const handleSuspendUser = async (data: UsersItem & { remarks?: string }) => {
    try {
      if (!data.UserId) throw new Error("Missing UserId");
      const result = await suspendUser(data.UserId, data.remarks);
      if (result.success) {
        await loadUsers(
          roleConfig,
          roleKey,
          setData,
          setKaboMap,
          setOperatorMap,
          setPscoBranchMap,
          setLoading
        );
        Swal.fire({
          icon: "success",
          title: "User suspended",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Suspend Failed",
          text: result.message,
        });
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Unexpected Error",
        text: err?.message || "An error occurred.",
      });
    }
  };

  const handleUpdate = async (formData: UpdateUserPayload) => {
    await handleUpdateUser(
      formData,
      () =>
        loadUsers(
          roleConfig,
          roleKey,
          setData,
          setKaboMap,
          setOperatorMap,
          setPscoBranchMap,
          setLoading
        ),
      () => setIsCreateModalOpen(false)
    );
  };

  return (
    <Suspense fallback={<UsersSkeletonPage />}>
      <div className="mx-auto px-0 py-8 md:py-0">
        <h1 className="text-3xl font-bold mb-3">{label}</h1>
        <CardsPage
          dashboardData={data.map((user) => ({
            ...user,
            LastLogin: user.LastLogin ?? undefined,
            LastTokenRefresh: user.LastTokenRefresh ?? undefined,
            DateOfRegistration: user.DateOfRegistration ?? undefined,
            UserStatusId: user.UserStatusId ?? undefined,
          }))}
          roleLabel={label}
          textlabel={textlabel}
          loading={loading}
        />

        {currentUserType !== 3 && (
          <ChartsDataPage
            pageType={roleKey}
            dashboardData={
              data.map((user) => ({
                ...user,
                region: user.Region?.RegionName || "Unknown",
              }))
            }
            loading={loading}
          />
        )}

        <DetailedTable<UsersItem>
          data={data}
          columns={columns}
          pageType={roleKey}
          roleId={roleId}
          operatorMap={operatorMap}
          statsPerRegion={data}
          source="users"
          onAddClick={openCreateModal}
          onUpdateClick={openUpdateModal}
          onSubmit={handleSuspendUser}
          loading={loading}
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
  );
}
