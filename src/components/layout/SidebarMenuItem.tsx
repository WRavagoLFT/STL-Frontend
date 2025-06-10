import React from "react";
import clsx from "clsx";
import { useRouter } from "next/router";
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
} from "react-icons/fa";

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

// menu visibility - 'ACCESS GUARD component' is different since this only restricts from VIEWING.
const MENU_VISIBILITY: Record<string, number[]> = {
  Dashboard: [1, 2, 3, 4, 6],
  Managers: [6],
  Executive: [6],
  Operators: [6],
  Kabo: [3, 4],
  Kubrador: [3, 4],
  "Betting Summary": [3, 4, 6],
  "Winning Summary": [3, 4, 6],
  "Draw Summary": [3, 4, 5, 6,],
  "Device Information": [5],
  "Retail Receipt": [3, 4, 6],
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
  "Device Information": "/device-information",
  "Retail Receipt": "/retail-receipt",
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
  const currentPath = router.asPath;

  if (!MENU_VISIBILITY[label]?.includes(userTypeId)) return null;

  const submenu =
    label === "Betting Summary"
      ? BETTING_SUBMENUS
      : label === "Winning Summary"
      ? WINNING_SUBMENUS
      : null;

  const path = routeMap[label] ?? `/${label.toLowerCase().replace(/\s+/g, "-")}`;
  const isGroup = submenu !== null;

  const isGroupActive = currentPath.startsWith(path);
  const isActive = (path: string) => currentPath === path;

  const handleListItemClick = (subItem: (typeof BETTING_SUBMENUS)[number]) => {
    setSideBarActiveGameType(subItem.name as any);
    router.push(subItem.path);
  };

  const renderSubmenu = (items: typeof BETTING_SUBMENUS) =>
    items.map(({ name, path }) => (
      <div
        key={path}
        onClick={() => handleListItemClick({ name, path })}
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
    <div key={label}>
      <div
        onClick={() => {
          setOpenSubmenu(openSubmenu === label ? null : label);
          if (!isGroupActive) {
            if (isGroup) {
              setSideBarActiveGameType("Dashboard");
              router.push(`${path}/dashboard`);
            } else {
              router.push(path);
            }
          }
        }}
        className={clsx(
          "flex items-center justify-between px-4 py-2 cursor-pointer rounded-md",
          isGroupActive
            ? "bg-[#F6BA12] text-[#0038A8] font-semibold"
            : "hover:text-[#F6BA12] text-gray-300"
        )}
      >
        <span className="flex items-center gap-3 text-sm">
          {iconMap[label]}
          {!collapsed && label}
        </span>
      </div>
      {!collapsed && isGroupActive && submenu && renderSubmenu(submenu)}
    </div>
  );
};

export default SidebarMenuItem;
