"use client";

import React, { useEffect, useState } from "react";
import BackIconButton from "../ui/icons/BackButton";
import { UserSectionData } from "../../data/AdminSectionData";
import DateTimeDisplay from "./DateTimeDisplay";

interface SidebarUserSectionProps {
  collapsed: boolean;
  toggleCollapse: () => void;
}

const SidebarLogoSection: React.FC<SidebarUserSectionProps> = ({
  collapsed,
  toggleCollapse,
}) => {
  const [dateTime, setDateTime] = useState<Date | null>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className={`flex items-center ${
        collapsed ? "flex-col justify-center" : "flex-row justify-center"
      }`}
    >
      <div className="bg-[#ACA993] pt-1 rounded-md w-full">
        <div className="flex justify-between px-3 py-3 w-full">
          <BackIconButton
            onClick={toggleCollapse}
            isSidebarToggled={collapsed} 
          />
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
        {/* render date and time */}
        <DateTimeDisplay dateTime={dateTime} collapsed={collapsed} />
      </div>
    </div>
  );
};

export default SidebarLogoSection;
