import React from "react";

interface UserInfoProps {
  user: { firstName: string; lastName: string; userTypeId: number } | null;
  getUserRole: (userTypeId: number) => string;
  collapsed: boolean;
}

const UserInfo: React.FC<UserInfoProps> = ({ user, getUserRole, collapsed }) => {
  if (collapsed) return null;
  //console.log('USER TYPE ID SA USER INFO:', user?.userTypeId);

  return (
    <div className="pt-5 pb-3 px-1">
      <div className="text-2xl font-bold text-white leading-tight">
        {user ? (
          `${user.firstName} ${user.lastName}`
        ) : (
          <div className="w-24 h-5 bg-gray-300 rounded animate-pulse" />
        )}
      </div>
      <div className="text-xs text-white">
        {user ? getUserRole(user.userTypeId) : ""}
      </div>
    </div>
  );
};

export default UserInfo;
