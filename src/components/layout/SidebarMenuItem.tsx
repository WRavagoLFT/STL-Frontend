"use client";

import React, { useState } from "react";
import clsx from "clsx";
import {
  FaHome,
  FaBusinessTime,
  FaUserShield,
  FaDiceSix,
  FaBroadcastTower,
  FaMoneyBillAlt,
  FaStoreAlt,
  FaReceipt,
  FaUsers,
  FaBuilding,
  FaMobileAlt,
  FaDoorOpen,
} from "react-icons/fa";
import ActivityIndicator from "../auth/ActivityIndicator";
import { usePathname, useRouter } from "next/navigation";
import { logoutUser } from "@/lib/api/auth/auth.service";

interface SidebarMenuItemProps {
  label: string;
  userTypeId: number;
  openSubmenu: string | null;
  setOpenSubmenu: (label: string | null) => void;
  collapsed: boolean;
  setSideBarActiveGameType: (type: string) => void;
}

const BETTING_SUBMENUS = [
  { name: "Dashboard", path: "/betting-summary/dashboard" },
  { name: "STL Pares", path: "/betting-summary/stl-pares" },
  { name: "STL Swer2", path: "/betting-summary/stl-swer2" },
  { name: "STL Swer3", path: "/betting-summary/stl-swer3" },
  { name: "STL Swer4", path: "/betting-summary/stl-swer4" },
];

const WINNING_SUBMENUS = [
  { name: "Dashboard", path: "/winning-summary/dashboard" },
  { name: "STL Pares", path: "/winning-summary/stl-pares" },
  { name: "STL Swer2", path: "/winning-summary/stl-swer2" },
  { name: "STL Swer3", path: "/winning-summary/stl-swer3" },
  { name: "STL Swer4", path: "/winning-summary/stl-swer4" },
];

const MENU_VISIBILITY: Record<string, number[]> = {
  Dashboard: [1, 2, 3, 4, 6],
  Managers: [6],
  Executive: [6],
  Operators: [6],
  Kabo: [3, 4],
  Kubrador: [3, 4],
  "Betting Summary": [3, 4, 6],
  "Winning Summary": [3, 4, 6],
  "Draw Summary": [3, 4, 5, 6],
  "Device Information": [5],
  "Retail Receipt": [3, 4, 6],
  Logout: [1, 2, 3, 4, 5, 6],
};

const iconMap: Record<string, React.ReactNode> = {
  Dashboard: <FaHome size={19} />,
  Managers: <FaUserShield size={19} />,
  Executive: <FaBusinessTime size={19} />,
  Operators: <FaStoreAlt size={19} />,
  Kabo: <FaUsers size={19} />,
  Kubrador: <FaBuilding size={19} />,
  "Betting Summary": <FaDiceSix size={19} />,
  "Winning Summary": <FaMoneyBillAlt size={19} />,
  "Draw Summary": <FaBroadcastTower size={19} />,
  "Device Information": <FaMobileAlt size={19} />,
  "Retail Receipt": <FaReceipt size={19} />,
  Logout: <FaDoorOpen size={19} />,
};

const routeMap: Record<string, string> = {
  Dashboard: "/dashboard",
  Managers: "/users/managers",
  Executive: "/users/executives",
  Operators: "/operators",
  Kabo: "/users/kabo",
  Kubrador: "/users/kubrador",
  "Betting Summary": "/betting-summary",
  "Winning Summary": "/winning-summary",
  "Draw Summary": "/draw-summary",
  "Device Information": "/device",
  "Retail Receipt": "/retail-receipt",
  Logout: "#logout",
};

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  label,
  userTypeId,
  openSubmenu,
  setOpenSubmenu,
  collapsed,
  setSideBarActiveGameType,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!MENU_VISIBILITY[label]?.includes(userTypeId)) return null;

  const submenu =
    label === "Betting Summary"
      ? BETTING_SUBMENUS
      : label === "Winning Summary"
        ? WINNING_SUBMENUS
        : null;

  const slug =
    routeMap[label] ?? `/${label.toLowerCase().replace(/\s+/g, "-")}`;
  const isGroup = submenu !== null;
  const isGroupActive = pathname?.startsWith(slug);
  const isActive = (path: string) =>
    pathname === path ||
    pathname?.startsWith(path) ||
    pathname?.includes(`/comparison/${path.split("/").pop()}`);

  const handleLogout = async () => {
    if (label === "Logout") {
      try {
        setIsLoggingOut(true);
        await logoutUser();
        router.push("/");
      } catch (error) {
        setIsLoggingOut(false);
        console.error("Logout failed:", error);
      }
      return;
    }

    if (isGroup) {
      setOpenSubmenu(openSubmenu === label ? null : label);
      if (!isGroupActive) {
        setSideBarActiveGameType("Dashboard");
        router.push(`${slug}/dashboard`);
      }
    } else {
      router.push(slug);
    }
  };

  const renderSubmenu = (items: typeof BETTING_SUBMENUS) =>
    items.map(({ name, path }) => (
      <div
        key={path}
        onClick={() => {
          setSideBarActiveGameType(name as any);
          router.push(path);
        }}
        className={clsx(
          "ml-6 py-1.5 pl-4 pr-2 pt-3 rounded-md cursor-pointer text-sm transition-colors",
          isActive(path)
            ? "text-[#F6BA12] font-semibold"
            : "text-gray-300 hover:text-white"
        )}
      >
        {name}
      </div>
    ));

  return (
    <>
      <div key={label}>
        <div
          onClick={handleLogout}
          className={clsx(
            "flex items-center justify-start px-4 py-2 cursor-pointer rounded-md",
            isGroupActive && label !== "Logout"
              ? "bg-[#F6BA12] text-[#0038A8] font-semibold"
              : "hover:text-[#F6BA12] text-gray-300"
          )}
        >
          <span
            className={clsx(
              "text-sm w-full",
              collapsed
                ? "flex justify-center items-center h-10"
                : "flex items-center gap-3"
            )}
          >
            {iconMap[label]}
            {!collapsed && label}
          </span>
        </div>
        {!collapsed && isGroupActive && submenu && renderSubmenu(submenu)}
      </div>
      {isLoggingOut && <ActivityIndicator />}
    </>
  );
};

export default SidebarMenuItem;
