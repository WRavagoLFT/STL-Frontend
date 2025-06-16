import { Box, Grid } from "@mui/material";
import { cardDashboardStyles } from "~/styles/theme";

interface SkeletonCardProps {
  height?: string | number;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ height = "110px" }) => (
  <div
    className="flex-[1_1_200px] bg-[#7A7766] rounded-lg m-0"
    style={{ height }}
  />
);

export const DashboardSkeletonPage: React.FC = () => {
  return (
    <div className="animate-pulse mt-8 md:mt-0 space-y-4">
      {/* Top Line Skeletons */}
      {[...Array(2)].map((_, index) => (
        <div key={index} className="h-4 w-[15%] bg-[#7A7766] rounded-lg" />
      ))}

      {/* Horizontal Skeleton Cards */}
      <div className="flex flex-wrap gap-4">
        {[...Array(5)].map((_, index) => (
          <SkeletonCard key={index} height="99px" />
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="flex flex-col items-center space-y-4 mt-4">
        <div className="w-full space-y-4">
          <div className="w-full flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Left Column */}
            <div className="space-y-6 w-full lg:w-2/5">
              <SkeletonCard height="189px" />
              <SkeletonCard height="189px" />
              <SkeletonCard height="195px" />
            </div>

            {/* Right Column */}
            <div className="space-y-6 w-full lg:w-3/5">
              <SkeletonCard height="300px" />
              <SkeletonCard height="300px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
