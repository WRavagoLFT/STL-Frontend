"use client";

import React, { useCallback, useEffect, useState } from "react";
import UpdateDeviceForm from "@/components/device-information/UpdateDeviceForm";
import BackIconButton from "@/components/ui/icons/BackButton";
import UpdateUserForm from "@/components/user/UpdateUserForm";
import AddDeviceForm from "@/components/device-information/AddDeviceForm";
import EditLogsTablePage from "@/components/ui/tables/EditLogTable";
import { userEditColumns } from "@/config/userEditLogTableColumns";
import Input from "@/components/ui/inputs/TextInputs";
import useUserStore from "@/store/useUserStore";
import { useAuthStore } from "@/store/useAuthStore";
import { FaMobileAlt } from "react-icons/fa";
import { loadUsers } from "@/hooks/useLoadUsers";
import dayjs from "dayjs";
import { handleAddDevice } from "@/hooks/handleAddDeviceAction";
import { handleUpdateDevice } from "@/hooks/handleUpdateDeviceAction";
import { handleUpdateUser } from "@/hooks/handleUpdateUserAction";
import { useRouter } from "next/navigation";
import { useLoadDevices } from "../device-information/ParentDevice";
import { editLogUser, UpdateUserPayload, UsersItem } from "@/lib/api/users/users.service";
import { fetchAndSetDevice } from "@/hooks/useLoadDevice";
import { AddDevicePayload, DeviceItem, UpdateDevicePayload } from "@/lib/api/device/device.service";

type UsersViewPageProps = {
  user: UsersItem;
  slug: string;
  onSubmit?: (data: UpdateUserPayload) => void;
  deviceId?: number;
};

const UsersViewPage: React.FC<UsersViewPageProps> = ({ user, slug }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"kabo" | "device" | "history">("kabo");
  const [device, setDevice] = useState<DeviceItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState<any[]>([]);
  const [editLoading, setEditLoading] = useState(false);
  const [columns, setColumns] = useState<any[]>([]);
  const {
    roleConfig,
    roleKey,
    setData,
    setKaboMap,
    setOperatorMap,
    setPscoBranchMap,
  } = useUserStore();
  const currentUserType = useAuthStore((state) => state.userTypeId);

  const titleInfo =
    user?.UserTypeId === 1
      ? "Kubrador Information"
      : user?.UserTypeId === 2
      ? "Kabo Information"
      : "User Information";

  const backUrl =
    user?.UserTypeId === 1
      ? "/users/kubrador"
      : user?.UserTypeId === 2
      ? "/users/kabo"
      : "/";

  const loadData = useLoadDevices(
    setLoading,
    () => {}, // define error handler if needed
    (devices) => {}, // optional: device setter if relevant
    (deviceInfo) => {} // optional
  );
  
  const onAddDeviceSubmit = async (data: AddDevicePayload) => {
    const redirectPath = `/users/users-view/${slug}`;
    await handleAddDevice(data, loadData, router, redirectPath);
  }; 

  const onUpdateDeviceSubmit = async (data: UpdateDevicePayload
  ) => {
    const redirectPath = `/users/users-view/${slug}`;
    await handleUpdateDevice(data, loadData, router, redirectPath);
  };
  
  const onUserUpdateSubmit = async (formData: UpdateUserPayload) => {
    await handleUpdateUser(
      formData,
      () => loadUsers(roleConfig, roleKey!, setData, setKaboMap, setOperatorMap, setPscoBranchMap, setLoading),
    );
  };

  useEffect(() => {    
    const shouldFetch = activeTab === "device" && !!user?.DeviceId;
    if (shouldFetch) {
      const slugString = `${user.DeviceId}-device`;
      fetchAndSetDevice(slugString, setDevice, setLoading);
    }
  }, [activeTab, user?.DeviceId]);

  const fetchLogs = useCallback(async () => {
    const userId = user?.UserId;

    if (activeTab === "history" && userId) {
      setEditLoading(true);

      try {
        const logsResponse = await editLogUser(userId);

        if (logsResponse?.success) {
          setEditData(logsResponse.data || []);
          setColumns(userEditColumns());
        } else {
          console.error("[ERROR] Failed to fetch edit logs:", logsResponse.message);
        }
      } catch (error) {
        console.error("[ERROR] Error loading edit logs:", error);
      } finally {
        setEditLoading(false);
      }
    } else {
      console.warn("[WARN] Skipping fetchLogs: either not in 'history' tab or UserId is missing.");
    }
  }, [activeTab, user?.UserId]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div>
      <div className="flex items-center space-x-4">
        <BackIconButton
          to={backUrl}
          bgColor="#0038A8"
          hoverColor="#004ccf"
          iconColor="#fff"
          size={30}
        />
        <div className="text-2xl md:text-3xl font-bold truncate">
          {user?.FirstName || "N/A"} {user?.LastName || "N/A"}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center my-4">
        {/* Left side */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <button
            onClick={() => setActiveTab("kabo")}
            className={`w-full rounded-lg px-6 py-4 text-sm font-bold ${
              activeTab === "kabo"
                ? "bg-[#F6BA12] hover:bg-[#FFD100]"
                : "bg-[#0038A8] hover:bg-[#004ccf] text-white"
            }`}
          >
            {titleInfo}
          </button>
          <button
            onClick={() => setActiveTab("device")}
            className={`w-full rounded-lg px-6 py-4 text-sm font-bold ${
              activeTab === "device"
                ? "bg-[#F6BA12] hover:bg-[#FFD100]"
                : "bg-[#0038A8] hover:bg-[#004ccf] text-white"
            }`}
          >
            Device Information
          </button>
        </div>

        {/* Right side */}
        <div className="flex justify-start">
          <button
            onClick={() => setActiveTab("history")}
            className={`w-full md:w-auto rounded-lg px-6 py-4 text-sm font-bold ${
              activeTab === "history"
                ? "bg-[#F6BA12] hover:bg-[#FFD100]"
                : "bg-[#0038A8] hover:bg-[#004ccf] text-white"
            }`}
          >
            Update History
          </button>
        </div>
      </div>

      {/* Conditionally render content based on activeTab */}
      {activeTab === "kabo" && (
        <div className="my-6">
          <UpdateUserForm
            operatorMap={{}}
            userTypeId={user?.UserTypeId ?? 0}
            selectedUser={user}
            onSubmit={onUserUpdateSubmit}
          />
        </div>
      )}
      
      {activeTab === "device" && !device ? (
        currentUserType !== 3 ? (
          <div className="my-6">
            <AddDeviceForm
              userid={user?.UserId}
              onSubmit={onAddDeviceSubmit}
            />
          </div>
        ) : (
          <div className="my-12 flex flex-col items-center text-gray-500">
            <FaMobileAlt size={40} className="mb-3" />
            <p className="text-lg font-semibold">No Device Information available for this user.</p>
          </div>
        )
      ) : null}

      {/* if theres a device id, update */}
      {activeTab === "device" && (
        <div className="my-6">
          {device ? (
            <UpdateDeviceForm
              device={device}
              deviceId={user?.DeviceId ?? undefined}
              userid={user?.UserId}
              onSubmit={onUpdateDeviceSubmit}
            />
          ) : null}
        </div>
      )}

      {activeTab === "history" && (
        <div>
          <div className="my-6">
            <div className="grid grid-cols-4 gap-6">
              {/* Created By */}
              <div className="flex flex-col w-full">
                <label htmlFor="CreatedBy" className="block text-sm">
                  Created By
                </label>
                <Input
                  type="text"
                  name="CreatedBy"
                  id="CreatedBy"
                  className="mt-1 w-full"
                  value={user?.CreatedBy || "N/A"}
                  disabled
                />
              </div>

              {/* Creation Date */}
              <div className="flex flex-col w-full">
                <label htmlFor="DateOfRegistration" className="block text-sm">
                  Creation Date
                </label>
                <Input
                  type="text"
                  name="DateOfRegistration"
                  id="DateOfRegistration"
                  className="mt-1 w-full"
                  value={
                    user?.DateOfRegistration
                      ? dayjs(user.DateOfRegistration).format("YYYY/MM/DD HH:mm:ss")
                      : "N/A"
                  }
                  disabled
                />
              </div>

              {/* Last Updated By */}
              <div className="flex flex-col w-full">
                <label htmlFor="LastUpdatedBy" className="block text-sm">
                  Last Updated By
                </label>
                <Input
                  type="text"
                  name="LastUpdatedBy"
                  id="LastUpdatedBy"
                  className="mt-1 w-full"
                  value={user?.LastUpdatedBy || "N/A"}
                  disabled
                />
              </div>

              {/* Last Updated Date */}
              <div className="flex flex-col w-full">
                <label htmlFor="LastUpdatedDate" className="block text-sm">
                  Last Updated Date
                </label>
                <Input
                  type="text"
                  name="LastUpdatedDate"
                  id="LastUpdatedDate"
                  className="mt-1 w-full"
                  value={
                    user?.LastUpdatedDate
                      ? dayjs(user.LastUpdatedDate).format("YYYY/MM/DD HH:mm:ss")
                      : "N/A"
                  }
                  disabled
                />
              </div>
            </div>
          </div>
          <EditLogsTablePage data={editData} columns={columns} loading={editLoading}/>
        </div>
      )}
    </div>
  );
};

export default UsersViewPage;

