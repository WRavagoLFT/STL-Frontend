"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { DeviceItem, editLogDevice, fetchUsageNotes, UpdateDevicePayload } from "@/lib/api/device/device.service";
import { useLoadDevices } from "./ParentDevice";
import { handleUpdateDevice } from "@/hooks/handleUpdateDeviceAction";
import { deviceEditColumns } from "@/config/deviceEditLogTableColumns";
import BackIconButton from "../ui/icons/BackButton";
import UpdateDeviceForm from "./UpdateDeviceForm";
import Input from "../ui/inputs/TextInputs";
import { UsersSkeletonPage } from "../user/UsersSkeleton";
const EditLogsTablePage = dynamic(() => import("@/components/ui/tables/EditLogTable"), {ssr: false, loading: () => <UsersSkeletonPage/>})

type DevicesViewPageProps = {
  slug: string;
  onSubmit?: (data: UpdateDevicePayload) => void;
  device: DeviceItem;
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
  const [setDevice] = useState<DeviceItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  
  const loadData = useLoadDevices(
    setLoading,
    () => {},
    (devices) => {},
    (deviceInfo) => {}
  );
  
  const router = useRouter();

  const onUpdateDeviceSubmit = async (data: UpdateDevicePayload) => {
    const redirectPath = `/device-information/device-information-view/${slug}`;
    await handleUpdateDevice(data, loadData, router, redirectPath);
  };

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
          to="/device"
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