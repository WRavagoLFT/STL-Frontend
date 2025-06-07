import React from "react";
import AddDeviceForm from "~/components/device-information/AddDeviceForm";
import BackIconButton from "~/components/ui/icons/BackButton";
import { Device } from "~/types/types";

type AddDevicePageProps = {
  onClose?: () => void;
  onSubmit: (data: Device) => void;
};

export default function AddDevicePage({
  onClose,
  onSubmit,
}: AddDevicePageProps) {
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
        <div className="text-2xl md:text-3xl font-bold truncate">
            Add Device
        </div>
      </div>
      <AddDeviceForm onSubmit={onSubmit} onClose={onClose} />
    </>
  );
}
