import React, { useEffect, useState } from "react";
import UpdateDeviceForm from "~/components/device-information/UpdateDeviceForm";
import BackIconButton from "~/components/ui/icons/BackButton";
import UpdateUserForm from "~/components/user/UpdateUserForm";
import { Device, User } from "~/types/types";
import { fetchAndSetDevice } from "../../device-information/device-information-view/[slug]";
import AddDeviceForm from "~/components/device-information/AddDeviceForm";

type UsersViewPageProps = {
  user?: User;
  slug: string;
  onSubmit?: (data: User) => void;
};

const UsersViewPage: React.FC<UsersViewPageProps> = ({ user, slug }) => {
  const [activeTab, setActiveTab] = useState<"kabo" | "device" | "history">("kabo");
  // console.log(user);

  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(false);

  const backUrl =
    user?.data.UserTypeId === 1
      ? "/users/kubrador"
      : user?.data.UserTypeId === 2
      ? "/users/kabo"
      : "/";

  useEffect(() => {
    console.log("activeTab changed:", activeTab);
    console.log("user?.data.DeviceId:", user?.data?.DeviceId);
    
    const shouldFetch = activeTab === "device" && !!user?.data?.DeviceId;
    if (shouldFetch) {
      const slugString = `${user.data.DeviceId}-device`;
      console.log("fetching device with slug:", slugString);
      fetchAndSetDevice(slugString, setDevice, setLoading);
    }
  }, [activeTab, user?.data?.DeviceId]);

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
              onSubmit={(data) => {
                console.log("Submitted user:", data);
              }}
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
              onSubmit={(data) => {
                console.log("Submitted user:", data);
              }}
            />
          ) : null}
        </div>
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

export default UsersViewPage;
