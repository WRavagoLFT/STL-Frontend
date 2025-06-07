import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { gameType, useSideBarStore } from "../../store/useSideBarStore";
import { getCurrentUser, logoutUser } from "~/utils/api/auth";
import { FaSignOutAlt } from "react-icons/fa";
import { useAuthStore } from "~/store/useAuthStore";
import UserInfo from "./UserInfo";
import SidebarMenuItem from "./SidebarMenuItem";
import SidebarLogoSection from "./SidebarLogoSection";

const Sidebar: React.FC = () => {
  const router = useRouter();
  //const currentPath = router.asPath;
  const { setSideBarActiveGameType } = useSideBarStore();
  const userTypeId = useAuthStore((state) => state.userTypeId);
  const [collapsed, setCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [user, setUser] = useState<{firstName: string; lastName: string; userTypeId: number;} | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutUser();

      // we need to handle this gracefully (w/o glitch)
      // this resets the value of the prev user (role)
      //const authStore = useAuthStore.getState();
      //const sidebarStore = useSideBarStore.getState();

      //if (typeof authStore.reset === "function") authStore.reset();
      //if (typeof sidebarStore.reset === "function") sidebarStore.reset();

      router.push("/auth/login");
    } catch (error) {
      //setIsLoggingOut(false); 
      console.error("Logout failed:", error);
    }
  };

  const getUserRole = (userTypeId: number) => {
    switch (userTypeId) {
      case 1:
        return "Kubrador";
      case 2:
        return "Kabo";
      case 3:
        return "AAC - Executive";
      case 4:
        return "AAC - Manager"; 
      case 5:
        return "Provincial Admin";
      case 6:
        return "Administrator";
      default:
        return "Unknown Role";
    }
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const response = await getCurrentUser({});
      //console.log("getcurrentuser response", response);

      if (response && response.data) {
        setUser({
          firstName: response.data.FirstName,
          lastName: response.data.LastName,
          userTypeId: response.data.UserTypeId,
        });
      }
    };

    fetchUser();
  }, []);

  //if (isLoggingOut) return <div className="p-4 text-white">Logging out...</div>;
  // console.log("User state:", user);
  if (userTypeId === null) {
    return null; // or loading spinner
  }

  return (
    <div
      className={`p-3 bg-blue-800 text-white flex flex-col transition-all duration-200 
    ${collapsed ? "w-20" : "w-64"} sticky top-0 h-screen z-50 overflow-y-auto sidebar-scrollbar`}
    >
      <SidebarLogoSection
        collapsed={collapsed}
        toggleCollapse={toggleCollapse}
      />

      {!collapsed && (
        <UserInfo user={user} getUserRole={getUserRole} collapsed={collapsed} />
      )}

      <nav className="flex flex-col space-y-1 mt-1 px-1">
        {[
          "Dashboard",
          "Kabo", // read only page
          "Kubrador", // read only page
          "Managers",
          "Executive",
          "Operators", 
          "Betting Summary",
          "Winning Summary",
          "Draw Summary",
          "Device Information", // for provincial role
          "Retail Receipt",
        ].map((label) => (
          <SidebarMenuItem
            key={label}
            label={label}
            userTypeId={userTypeId}
            openSubmenu={openSubmenu}
            setOpenSubmenu={setOpenSubmenu}
            collapsed={collapsed}
            setSideBarActiveGameType={(label) =>
              setSideBarActiveGameType(label as gameType)
            }
          />
        ))}
      </nav>

      {!collapsed && (
        <div
          onClick={handleLogout}
          className="flex items-center mt-2 px-4 py-2 cursor-pointer rounded-md text-sm transition-colors hover:bg-blue-700"
        >
          <FaSignOutAlt size={20} />
          {!collapsed && <span className="ml-2">Logout</span>}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
