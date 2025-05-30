import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DetailedTable from "~/components/ui/tables/DetailedTable";
import ChartsDataPage from "~/components/ui/charts/UserChartsData";
import { userTableColumns } from "~/config/userTableColumns";
import useUserRoleStore from "../../../store/useUserStore";
import CardsPage from "~/components/user/CardsData";
import { addUser, editLogUser, fetchUsers, updateUser } from "~/utils/api/users";
import AddUserModal from "~/components/user/AddUser";
import { User } from "~/types/types";
import UpdateUserModal from "~/components/user/UpdateUser";
import Swal from "sweetalert2";
import EditModalPage from "~/components/ui/modals/EditLogModalWrapper";
import { userEditColumns } from "~/config/userEditLogTableColumns";

const roleMap: Record<string, { label: string; textlabel: string; roleId: number }> = {
managers: {
    label: "Small Town Lottery Manager",
    textlabel: "Managers",
    roleId: 4,
  },
  executive: {
    label: "Small Town Lottery Executive",
    textlabel: "Executives",
    roleId: 3,
  },
};

const RolePage = () => {
  const { query } = useRouter();
  const role = query.role as string;
  const roleKey = role?.toLowerCase().includes("manager") ? "manager" : "executive";
  const roleConfig = roleMap[role?.toLowerCase() || ""];
  const operatorMap = useUserRoleStore((state) => state.operatorMap);
  const setOperatorMap = useUserRoleStore((state) => state.setOperatorMap);
  const { data, setData } = useUserRoleStore();

  const { roleId, label, textlabel } = roleConfig;
  const tableColumns = userTableColumns();
  const editLogtableColumns = userEditColumns();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const openCreateModal = () => {setIsCreateModalOpen(true);};
  const closeCreateModal = () => {setIsCreateModalOpen(false);};
  const openUpdateModal = (user: User) => {setSelectedUser(user);setIsUpdateModalOpen(true);};
  const closeUpdateModal = () => {setSelectedUser(null);setIsUpdateModalOpen(false);};
  const [showEditLog, setShowEditLog] = useState(false);

  const openEditLogModal = (user: User) => {setSelectedUser(user);setShowEditLog(true);};

  useEffect(() => {
    if (roleConfig?.roleId) {
      fetchUsers(roleConfig.roleId, setData).then((map) => {
        if (map) setOperatorMap(map);
      });
    }
  }, [roleConfig, setData]);

  //console.log("DATA USER", data);
  //console.log("operatormappp", operatorMap);

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
        await fetchUsers(roleConfig.roleId, setData);

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
        await fetchUsers(roleConfig.roleId, setData);

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
        />
      )}

    </div>
  );
};

export default RolePage;
