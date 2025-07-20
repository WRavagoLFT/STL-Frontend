"use client";

import React, { useState } from "react";
import { gameType, useSideBarStore } from "../../store/useSideBarStore";
import { FaBars } from "react-icons/fa";
import { useAuthStore } from "@/store/useAuthStore";
import UserInfo from "./UserInfo";
import SidebarMenuItem from "./SidebarMenuItem";
import SidebarLogoSection from "./SidebarLogoSection";
import { useRouter } from "next/navigation";

const Sidebar: React.FC = () => {
  const router = useRouter();
  const { setSideBarActiveGameType } = useSideBarStore();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const userTypeId = useAuthStore((state) => state.userTypeId);
  const user = useAuthStore((state) => state.user);
  
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

  if (userTypeId === null) return null;

  return (
    <div>
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
      <div
        className={`fixed top-0 left-0 h-full z-40 transition-transform duration-200
        ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:flex`}
      >
        <div
          className={`p-3 bg-blue-800 text-white flex flex-col transition-all duration-200 
          ${collapsed ? "w-20" : "w-[18rem]"} sticky top-0 h-screen z-50 overflow-y-auto sidebar-scrollbar scrollbar-hide`}
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
              "Logout",
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
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;
