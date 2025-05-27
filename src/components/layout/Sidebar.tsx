import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSideBarStore, gameType } from "../../store/useSideBarStore";
import { UserSectionData } from "../../data/AdminSectionData";
import { getCurrentUser, logoutUser } from "~/utils/api/auth";
import {
  FaSignOutAlt,
  FaHome,
  FaBusinessTime,
  FaUserShield,
  FaDiceSix,
  FaBroadcastTower,
  FaMoneyBillAlt,
  FaStoreAlt,
  FaChevronLeft,
  FaChevronRight,
  FaReceipt,
} from "react-icons/fa";
import clsx from "clsx";

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

const getUserRole = (userTypeId: number) => {
  switch (userTypeId) {
    case 1:
      return "Kubrador";
    case 2:
      return "Kabo";
    case 3:
      return "Executive";
    case 4:
      return "Manager";
    case 5:
      return "Provincial Admin";
    case 6:
      return "Administrator";
    default:
      return "Unknown Role";
  }
};

const Sidebar: React.FC = () => {
  const router = useRouter();
  const currentPath = router.asPath;
  const { SideBarActiveGameType, setSideBarActiveGameType } = useSideBarStore();
  const isCurrent = (path: string) => currentPath === path;
  const isGroupActive = (groupPath: string) =>
    currentPath.startsWith(groupPath);

  const [collapsed, setCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [dateTime, setDateTime] = useState<Date | null>(null);
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
    userTypeId: number;
  } | null>(null);

  const formattedDate =
    dateTime?.toLocaleDateString("en-PH", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }) ?? "N/A";

  const formattedTime =
    dateTime?.toLocaleTimeString("en-PH", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }) ?? "N/A";

  useEffect(() => {
    const updateDateTime = () => setDateTime(new Date());
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // get current user
  useEffect(() => {
    (async () => {
      try {
        const response = await getCurrentUser({});
        if (response.success && response.data) {
          setUser({
            firstName: response.data.FirstName,
            lastName: response.data.LastName,
            userTypeId: response.data.UserTypeId,
          });
        } else {
          console.error("Failed to fetch user:", response.message);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    })();
  }, []);

  const handleListItemClick = (subItem: (typeof BETTING_SUBMENUS)[number]) => {
    setSideBarActiveGameType(subItem.name as gameType);
    router.push(subItem.path);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const renderSubmenu = (items: typeof BETTING_SUBMENUS) =>
    items.map(({ name, path }) => {
      const isActive = SideBarActiveGameType === name;

      return (
        <div
          key={path}
          onClick={() => handleListItemClick({ name, path })}
          className={clsx(
            "ml-6 py-2 pl-4 pr-2 pt-3 rounded-md cursor-pointer text-sm transition-colors",
            isActive
              ? "text-[#F6BA12] font-semibold"
              : "text-gray-300 hover:text-white"
          )}
        >
          {name}
        </div>
      );
    });

  const toggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  const renderMenuItem = (label: string) => {
    const iconSize = 19;

    const iconMap: Record<string, React.ReactNode> = {
      Dashboard: <FaHome size={iconSize} />,
      Managers: <FaUserShield size={iconSize} />,
      Executive: <FaBusinessTime size={iconSize} />,
      "Betting Summary": <FaDiceSix size={iconSize} />,
      "Winning Summary": <FaMoneyBillAlt size={iconSize} />,
      "Draw Summary": <FaBroadcastTower size={iconSize} />,
      Operators: <FaStoreAlt size={iconSize} />,
      "Retail Receipt": <FaReceipt size={iconSize} />,
    };

    const routeMap: Record<string, string> = {
      Dashboard: "/dashboard",
      Managers: "/managers",
      Executive: "/executives",
      "Betting Summary": "/betting-summary",
      "Winning Summary": "/winning-summary",
      "Draw Summary": "/draw-summary",
      Operators: "/operators",
      "Retail Receipt": "/retail-receipt",
    };

    const submenu =
      label === "Betting Summary"
        ? BETTING_SUBMENUS
        : label === "Winning Summary"
          ? WINNING_SUBMENUS
          : null;

    const path =
      routeMap[label] ?? `/${label.toLowerCase().replace(/\s+/g, "-")}`;

    const isGroup = submenu !== null;

    return (
      <div key={label}>
        <div
          onClick={() => {
            setOpenSubmenu(openSubmenu === label ? null : label);
            if (!isGroupActive(path)) {
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
            isGroupActive(path)
              ? "bg-[#F6BA12] text-[#0038A8] font-semibold"
              : "hover:text-[#F6BA12] text-gray-300"
          )}
        >
          <span className="flex items-center gap-2 text-sm">
            {iconMap[label]}
            {!collapsed && label}
          </span>
        </div>
        {!collapsed &&
          openSubmenu === label &&
          submenu &&
          renderSubmenu(submenu)}
      </div>
    );
  };

  return (
    <div className={`p-3 bg-blue-800 text-white flex flex-col transition-all duration-200 ${ collapsed ? "w-20" : "w-60" }`}>
      <div
        className={`flex items-center ${
          collapsed ? "flex-col justify-center" : "flex-row justify-center"
        }`}
      >
        {/* User Section */}
        <div className="bg-[#ACA993] pt-1 rounded-md w-full">
          <div className="flex justify-between px-3 py-3 w-full">
            {/* Toggle Collapse Icon (Left Corner) */}
            <button
              onClick={toggleCollapse}
              className="flex justify-center items-center bg-[#0038A8] text-[#ACA993] rounded-full w-6 h-6 p-1 hover:bg-gray-300 transition-colors duration-200"
            >
              {collapsed ? (
                <FaChevronRight size={12} />
              ) : (
                <FaChevronLeft size={12} />
              )}
            </button>

            {/* Logo (Right Corner) */}
            {!collapsed && (
              <div className="flex ml-auto">
                <img
                  src={UserSectionData.image}
                  alt="Logo"
                  className="transition-all duration-300 max-w-[8rem]"
                />
              </div>
            )}
          </div>

          {/* Time and Date */}
          {!collapsed && (
            <div className="text-[#0038A8] px-3 py-2 leading-none">
              <div className="text-xs md:text-sm lg:text-2xl font-bold leading-none mb-0">
                {formattedTime}
              </div>
              <div className="text-xs leading-none mt-0">{formattedDate}</div>
            </div>
          )}
        </div>
      </div>

      {/* User Info */}
      {!collapsed && (
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
      )}

      {/* Navigation Menu */}
      <nav className={`flex-1 space-y-3 ${collapsed ? "mt-5" : ""}`}>
        {UserSectionData.pages.map(renderMenuItem)}

        {/* Logout Button */}
        <div
          onClick={handleLogout}
          className="flex items-center px-4 py-2 cursor-pointer rounded-md text-sm transition-colors hover:bg-blue-700"
        >
          <FaSignOutAlt size={20} />
          {!collapsed && <span className="ml-2">Logout</span>}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
