import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AddDeviceForm from "~/components/device-information/AddDeviceForm";
import BackIconButton from "~/components/ui/icons/BackButton";
import { Device } from "~/types/types";
import { useLoadDevices } from "..";
import { handleAddDevice } from "~/hooks/handleAddDeviceAction";

export default function AddDevicePage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceInfoData, setDeviceInfoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useLoadDevices(setLoading, setError, setDevices, setDeviceInfoData);
  const router = useRouter();

  const onSubmit = async (data: Device) => {
    const redirectPath = `/device-information`;
    await handleAddDevice(data, loadData, router, redirectPath);
  };

  return (
    <>
      <div className="flex items-center space-x-4 mb-4">
        <BackIconButton
          to="/device-information"
          bgColor="#0038A8"
          hoverColor="#004ccf"
          iconColor="#fff"
          size={30}
        />
        <div className="text-2xl md:text-3xl font-bold truncate">Add Device</div>
      </div>
      <AddDeviceForm onSubmit={onSubmit} />
    </>
  );
}
