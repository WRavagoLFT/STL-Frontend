"use client";

import React, { useCallback, useEffect, useState } from "react";
import UpdateDeviceForm from "~/components/device-information/UpdateDeviceForm";
import BackIconButton from "~/components/ui/icons/BackButton";
import { Device } from "~/types/types";
import { editLogDevice, fetchUsageNotes } from "~/lib/api/device";
import { useRouter } from "next/navigation";
import { deviceEditColumns } from "~/config/deviceEditLogTableColumns";
import EditLogsTablePage from "~/components/ui/tables/EditLogTable";
import Input from "~/components/ui/inputs/TextInputs";
import { handleUpdateDevice } from "~/hooks/handleUpdateDeviceAction";
import { useLoadDevices } from "~/components/device-information/ParentDevice";

type DevicesViewPageProps = {
  slug: string;
  onSubmit?: (data: Device) => void;
  device: Device;
};

export const getUsageNotes = async (setUsageNotes: (data: any[]) => void) => {
  const res = await fetchUsageNotes();
  if (res.success !== false) {
    setUsageNotes(res.data || res);
  }
};

export const DevicesViewPage: React.FC<DevicesViewPageProps> = ({ device, slug }) => {
  const [activeTab, setActiveTab] = useState<"kabo" | "device" | "history">(
    "kabo"
  );
  console.log(device);
  const [setDevice] = useState<Device | null>(null);
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

  const onUpdateDeviceSubmit = async (data: Device) => {
    const redirectPath = `/device-information/device-information-view/${slug}`;
    await handleUpdateDevice(data, loadData, router, redirectPath);
  };

  // for edit logs
  const fetchLogs = useCallback(async () => {
    if (activeTab === "history" && device?.DeviceId) {
      try {
        const logsResponse = await editLogDevice(device?.DeviceId);

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
  }, [activeTab, device?.DeviceId]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div>
      <div className="flex items-center space-x-4">
        <BackIconButton
          to="/device-information"
          bgColor="#0038A8"
          hoverColor="#004ccf"
          iconColor="#fff"
          size={30}
        />
        <div className="text-2xl md:text-3xl font-bold truncate">
          {device?.AssignedUser ? device?.AssignedUser : "Unassigned Device"}
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
            onClick={() => setActiveTab("history")}
            className={`w-full rounded-lg px-12 py-4 text-sm font-bold ${
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
          <UpdateDeviceForm
            device={device}
            onSubmit={onUpdateDeviceSubmit}
          />
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
                  value={device?.IssuedBy || "N/A"}
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
                    device?.CreatedAt
                      ? device?.CreatedAt.slice(0, 10)
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
                  value={device?.AssignedUser || "N/A"}
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
                    device?.AssignmentDate
                      ? device?.AssignmentDate.slice(0, 10)
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