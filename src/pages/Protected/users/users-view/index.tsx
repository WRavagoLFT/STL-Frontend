import React from "react";
import BackIconButton from "~/components/ui/icons/BackButton";
import UpdateUserForm from "~/components/user/UpdateUserForm";
import { User } from "~/types/types";

type UsersViewPageProps = {
  user?: User;
  slug: string;
  onSubmit?: (data: User) => void;
};

const UsersViewPage: React.FC<UsersViewPageProps> = ({ user, slug }) => {
  console.log("USER IN THE SLUG", user);
  const backUrl =
    user?.data.UserTypeId === 1
      ? "/users/kubrador"
      : user?.data.UserTypeId === 2
        ? "/users/kabo"
        : "/";

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
          <button className="rounded-lg px-12 py-4 text-sm bg-[#F6BA12] hover:bg-[#FFD100] font-bold">
            Kabo Information
          </button>
          <button className="rounded-lg px-12 py-4 text-sm text-white bg-[#0038A8] hover:bg-[#004ccf] font-bold">
            Device Information
          </button>
        </div>

        {/* Right side - one button */}
        <div className="flex justify-start">
          <button className="rounded-lg px-12 py-4 text-sm text-white bg-[#0038A8] hover:bg-[#004ccf] font-bold">
            Update History
          </button>
        </div>
      </div>

      <UpdateUserForm
        operatorMap={{}}
        onSubmit={(data) => {
          console.log("Submitted user:", data);
        }}
        userTypeId={user?.data?.UserTypeId ?? 0}
        selectedUser={user?.data}
      />
    </div>
  );
};

export default UsersViewPage;
