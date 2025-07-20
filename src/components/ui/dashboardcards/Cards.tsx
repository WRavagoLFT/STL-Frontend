import React from "react";
import { CardProps } from "@/types/interfaces";

export const Card = <T extends React.ReactNode>({
  label,
  value,
  color,
  style,
  loading,
}: CardProps<T>) => {
  return (
    <div
      className="px-4 py-[1.4rem] flex-[1_1_200px] rounded-lg border border-[#0038A8]"
      style={{
        backgroundColor: "transparent",
        ...style,
      }}
    >
      <p className="text-xs">{label}</p>

      {loading ? (
        <div className="mt-2 h-6 w-3/4 bg-gray-300 rounded animate-pulse" />
      ) : (
        <p
          className={`text-lg md:text-sm lg:text-lg xl:text-2xl font-bold ${
            color ?? ""
          }`}
        >
          {value}
        </p>
      )}
    </div>
  );
};

export default Card;
