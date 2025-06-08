import React, { useCallback, useEffect, useState } from "react";
import UpdateDeviceForm from "~/components/device-information/UpdateDeviceForm";
import BackIconButton from "~/components/ui/icons/BackButton";
import { Device } from "~/types/types";
import { fetchUsageNotes } from "~/utils/api/device";
import { handleUpdateDevice } from "../device-information-add/handleUpdateAction";
import { useLoadDevices } from "..";
import { useRouter } from "next/router";

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

const DevicesViewPage: React.FC<DevicesViewPageProps> = ({ device, slug }) => {
  const [activeTab, setActiveTab] = useState<"kabo" | "device" | "history">(
    "kabo"
  );

  const [setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = useLoadDevices(
    setLoading,
    () => {}, // define error handler if needed
    (devices) => {}, // optional: device setter if relevant
    (deviceInfo) => {} // optional
  );
  
  const router = useRouter();

  const onUpdateDeviceSubmit = async (data: Device) => {
    await handleUpdateDevice(data, loadData, router);
  };

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
        <UpdateDeviceForm
          device={device}
          onSubmit={onUpdateDeviceSubmit}
        />
      )}

      {activeTab === "history" && (
        <div>
          {/* Future Update History component */}
          <p>Update History Content Here</p>
        </div>
      )}
    </div>
  );
};

export default DevicesViewPage;
