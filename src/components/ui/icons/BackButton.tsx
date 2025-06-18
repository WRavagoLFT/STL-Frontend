import React from "react";
import { useRouter } from "next/router";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";

interface BackIconButtonProps {
  to?: string;
  onClick?: () => void;
  isSidebarToggled?: boolean;
  bgColor?: string;
  hoverColor?: string;
  iconColor?: string;
  size?: number;
}

const BackIconButton: React.FC<BackIconButtonProps> = ({
  to,
  onClick,
  isSidebarToggled = false,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) onClick();
    if (to) router.push(to);
  };

  return (
    <div
      onClick={handleClick}
      className="w-8 h-8 rounded-full bg-[#0038A8] hover:bg-[#F6BA12] flex items-center justify-center cursor-pointer"
    >
      {isSidebarToggled ? (
        <MdArrowForwardIos className="text-[#F8F0E3] text-[16px] hover:text-[#0038A8]" />
      ) : (
        <MdArrowBackIosNew className="text-[#F8F0E3] text-[16px] hover:text-[#0038A8]" />
      )}
    </div>
  );
};

export default BackIconButton;
