import React from "react";
import { useAuthStore } from "~/store/useAuthStore";

interface SkeletonCardProps {
  height?: string | number;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ height = "110px" }) => (
  <div
    className="flex-[1_1_200px] bg-gray-200 rounded-lg m-0"
    style={{ height }}
  />
);

export const UsersSkeletonPage: React.FC = () => {
  const currentUserType = useAuthStore((state) => state.userTypeId);

  return (
    <div className="animate-pulse space-y-4 py-8">
      {[...Array(2)].map((_, index) => (
        <div key={index} className="h-3 w-[35%] bg-gray-200 rounded-lg" />
      ))}

      <div className="flex flex-wrap gap-3">
        {[...Array(5)].map((_, index) => (
          <SkeletonCard key={index} height="87px" />
        ))}
      </div>

      {(currentUserType !== 3 && currentUserType !== 5) && (
        <div className="flex flex-wrap gap-3">
          <SkeletonCard height="345px" />
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        <SkeletonCard height="345px" />
      </div>
    </div>
  );
};
