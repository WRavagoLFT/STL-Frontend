import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { gameType, useSideBarStore } from "../../store/useSideBarStore";
import { getCurrentUser } from "~/utils/api/auth";
import { FaBars } from "react-icons/fa"; // removed FaSignOutAlt
import { useAuthStore } from "~/store/useAuthStore";
import UserInfo from "./UserInfo";
import SidebarMenuItem from "./SidebarMenuItem";
import SidebarLogoSection from "./SidebarLogoSection";

const Sidebar: React.FC = () => {
  const router = useRouter();
  const { setSideBarActiveGameType } = useSideBarStore();
  const userTypeId = useAuthStore((state) => state.userTypeId);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
    userTypeId: number;
  } | null>(null);

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
    if (window.innerWidth < 768) {
      setIsMobileSidebarOpen(false); 
    } else {
      setCollapsed((prev) => !prev); 
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const response = await getCurrentUser({});
      if (response?.data) {
        setUser({
          firstName: response.data.FirstName,
          lastName: response.data.LastName,
          userTypeId: response.data.UserTypeId,
        });
      }
    };

    fetchUser();
  }, []);

  if (userTypeId === null) return null;

  return (
    <>
      {/* Hamburger for mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        {!isMobileSidebarOpen && (
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="flex items-center justify-center w-10 h-10 bg-blue-800 text-white rounded-md"
          >
            <FaBars size={20} />
          </button>
        )}
      </div>

      {/* Sidebar overlay on mobile */}
      <div
        className={`fixed top-0 left-0 h-full z-40 transition-transform duration-200
        ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:flex`}
      >
        <div
          className={`p-3 bg-blue-800 text-white flex flex-col transition-all duration-200 
          ${collapsed ? "w-20" : "w-64"} sticky top-0 h-screen z-50 overflow-y-auto sidebar-scrollbar`}
        >
          <SidebarLogoSection
            collapsed={collapsed}
            toggleCollapse={toggleCollapse}
          />

          {!collapsed && (
            <UserInfo
              user={user}
              getUserRole={getUserRole}
              collapsed={collapsed}
            />
          )}

          <nav className="flex flex-col space-y-1 mt-1">
            {[
              "Dashboard",
              "Kabo",
              "Kubrador",
              "Managers",
              "Executive",
              "Operators",
              "Betting Summary",
              "Winning Summary",
              "Draw Summary",
              "Device Information",
              "Retail Receipt",
              "Logout", // ✅ Now logout is handled via SidebarMenuItem
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
        </div>
      </div>

      {/* Backdrop on mobile */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
