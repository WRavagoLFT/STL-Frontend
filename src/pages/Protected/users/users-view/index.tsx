import React, { useCallback, useEffect, useState } from "react";
import UpdateDeviceForm from "~/components/device-information/UpdateDeviceForm";
import BackIconButton from "~/components/ui/icons/BackButton";
import UpdateUserForm from "~/components/user/UpdateUserForm";
import { Device, User } from "~/types/types";
import { fetchAndSetDevice } from "../../device-information/device-information-view/[slug]";
import AddDeviceForm from "~/components/device-information/AddDeviceForm";
import { handleAddDevice } from "../../device-information/device-information-add/handleAddAction";
import { useLoadDevices } from "../../device-information";
import { useRouter } from "next/router";
import { handleUpdateDevice } from "../../device-information/device-information-add/handleUpdateAction";
import EditLogsTablePage from "~/components/ui/tables/EditLogTable";
import { deviceEditColumns } from "~/config/deviceEditLogTableColumns";
import { editLogDevice } from "~/utils/api/device";
import Input from "~/components/ui/inputs/TextInputs";

type UsersViewPageProps = {
  user?: User;
  slug: string;
  onSubmit?: (data: User) => void;
};

const UsersViewPage: React.FC<UsersViewPageProps> = ({ user, slug }) => {
  const [activeTab, setActiveTab] = useState<"kabo" | "device" | "history">("kabo");
  //console.log(user);
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  
  const loadData = useLoadDevices(
    setLoading,
    () => {}, // define error handler if needed
    (devices) => {}, // optional: device setter if relevant
    (deviceInfo) => {} // optional
  );
  
  const router = useRouter();

  const onAddDeviceSubmit = async (data: Device) => {
    await handleAddDevice(data, loadData, router);
  };

  const onUpdateDeviceSubmit = async (data: Device) => {
    await handleUpdateDevice(data, loadData, router);
  };

  const backUrl =
    user?.data.UserTypeId === 1
      ? "/users/kubrador"
      : user?.data.UserTypeId === 2
      ? "/users/kabo"
      : "/";

  useEffect(() => {
    //console.log("activeTab changed:", activeTab);
    //console.log("user?.data.DeviceId:", user?.data?.DeviceId);
    
    const shouldFetch = activeTab === "device" && !!user?.data?.DeviceId;
    if (shouldFetch) {
      const slugString = `${user.data.DeviceId}-device`;
      //console.log("fetching device with slug:", slugString);
      fetchAndSetDevice(slugString, setDevice, setLoading);
    }
  }, [activeTab, user?.data?.DeviceId]);

  // for edit logs
  const fetchLogs = useCallback(async () => {
    if (activeTab === "history" && user?.data?.DeviceId) {
      try {
        const logsResponse = await editLogDevice(user.data.DeviceId);

        if (logsResponse?.success) {
          setEditData(logsResponse.data || []);
          setColumns(deviceEditColumns());
        } else {
          console.error("Failed to fetch edit logs:", logsResponse.message);
        }
      } catch (error) {
        console.error("Error loading edit logs:", error);
      }
    }
  }, [activeTab, user?.data?.DeviceId]);

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
          {user?.data?.FirstName || "N/A"} {user?.data?.LastName || "N/A"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 items-center my-4">
        {/* Left side */}
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("kabo")}
            className={`w-full rounded-lg px-12 py-4 text-sm font-bold ${
              activeTab === "kabo"
                ? "bg-[#F6BA12] hover:bg-[#FFD100]"
                : "bg-[#0038A8] hover:bg-[#004ccf] text-white"
            }`}
          >
            Kabo Information
          </button>
          <button
            onClick={() => setActiveTab("device")}
            className={`w-full rounded-lg px-12 py-4 text-sm font-bold ${
              activeTab === "device"
                ? "bg-[#F6BA12] hover:bg-[#FFD100]"
                : "bg-[#0038A8] hover:bg-[#004ccf] text-white"
            }`}
          >
            Device Information
          </button>
        </div>

        {/* Right side - one button */}
        <div className="flex justify-start">
          <button
            onClick={() => setActiveTab("history")}
            className={`rounded-lg px-12 py-4 text-sm font-bold ${
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
        <UpdateUserForm
          operatorMap={{}}
          onSubmit={(data) => {
            console.log("Submitted user:", data);
          }}
          userTypeId={user?.data?.UserTypeId ?? 0}
          selectedUser={user?.data}
        />
      )}

      {/* if no device id, add */}
      {activeTab === "device" && (
        <div>
          {!device ? (
            <AddDeviceForm
              userid={user?.data?.UserId} // for the user assigned field
              onSubmit={onAddDeviceSubmit}
            />
          ) : null}
        </div>
      )}

      {/* if theres a device id, update */}
      {activeTab === "device" && (
        <div>
          {device ? (
            <UpdateDeviceForm
              device={device}
              deviceId={user?.data?.DeviceId}
              userid={user?.data?.UserId}
              onSubmit={onUpdateDeviceSubmit}
            />
          ) : null}
        </div>
      )}

      {activeTab === "history" && (
        <div>
          <div className="mb-6">
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
                  value={user?.data?.CreatedBy || "N/A"}
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
                    user?.data?.DateOfRegistration
                      ? user?.data?.DateOfRegistration.slice(0, 10)
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
                  value={user?.data?.LastUpdatedBy || "N/A"}
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
                    user?.data?.LastUpdatedDate
                      ? user?.data?.LastUpdatedDate.slice(0, 10)
                      : "N/A"
                  }
                  disabled
                />
              </div>
            </div>
          </div>
          <EditLogsTablePage data={editData} columns={columns} />
        </div>
      )}
    </div>
  );
};

export default UsersViewPage;
