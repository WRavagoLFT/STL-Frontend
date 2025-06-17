import React from "react";

const SkeletonBlock = ({
  height = "100px",
  className = "",
}: {
  height?: string;
  className?: string;
}) => (
  <div
    aria-hidden="true"
    className={`bg-[#7A7766] rounded-lg animate-pulse ${className}`}
    style={{ height }}
  />
);

const BettingSummarySkeleton: React.FC = () => {
  return (
    <div className="space-y-4 h-full mt-8 md:mt-0 animate-pulse">
      <div className="h-8 w-[250px] bg-[#7A7766] rounded-lg" />

      <div className="flex flex-wrap gap-4">
        {[...Array(5)].map((_, i) => (
          <SkeletonBlock key={i} height="99px" className="flex-[1_1_200px]" />
        ))}
      </div>

      <div className="flex flex-col items-center space-y-4">
        <div className="w-full space-y-4">
          <div className="w-full flex flex-col lg:flex-row lg:min-h-[500px] space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="w-full lg:w-1/3">
              <SkeletonBlock height="500px" />
            </div>

            <div className="w-full lg:w-2/3 flex flex-col space-y-5">
              <SkeletonBlock height="300px" />
              <SkeletonBlock height="300px" />
              <div className="self-end h-10 w-[160px] bg-[#7A7766] rounded-lg" />
            </div>
          </div>
          <SkeletonBlock height="400px" />
        </div>
      </div>
    </div>
  );
};

export default BettingSummarySkeleton;
