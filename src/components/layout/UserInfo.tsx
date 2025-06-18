import React from "react";
import { User } from "~/types/types";

interface UserInfoProps {
  user: User | null;
  getUserRole: (userTypeId: number) => string;
  collapsed: boolean;
}

const UserInfo: React.FC<UserInfoProps> = ({ user, getUserRole, collapsed }) => {
  if (collapsed) return null;

  return (
    <div className="pt-5 pb-3 px-1">
      <div className="text-2xl font-bold text-white leading-tight">
        {user ? (
          `${user.FirstName || ""} ${user.LastName || ""}`
        ) : (
          <div className="w-24 h-5 bg-gray-300 rounded animate-pulse" />
        )}
      </div>
      <div className="text-xs text-white">
        {user ? getUserRole(user.UserTypeId ?? 0) : ""}
      </div> 
    </div>
  );
};

export default UserInfo;
