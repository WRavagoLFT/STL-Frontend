import React from 'react';
import { AccessGuard } from '../auth/AccessGuard';

const SkeletonBox = ({ height = 'h-10', width = 'w-full', rounded = 'rounded-md' }) => (
  <div className={`bg-[#7A7766] animate-pulse ${height} ${width} ${rounded}`} />
);

export default function RetailReceiptSkeleton() {
  return (
    <AccessGuard allowedUserTypes={[3, 4, 6]}>
      <div className="mx-auto px-0 py-1">
        <SkeletonBox height="h-8" width="w-64" />

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:flex-wrap gap-4 mb-4 mt-4">
          {[...Array(1)].map((_, idx) => (
            <div className="flex-[1_1_200px]" key={idx}>
              <SkeletonBox height="h-5" width="w-24 mb-2" />
              <SkeletonBox height="h-8" width="w-[34.5rem] mb-2" />
            </div>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-5 gap-4 my-4">
          {[...Array(5)].map((_, idx) => (
            <div
              key={idx}
              className="bg-[#7A7766] p-4 rounded-lg shadow-sm animate-pulse"
            >
              <SkeletonBox height="h-4" width="w-1/2 mb-2" />
              <SkeletonBox height="h-8" width="w-2/3" />
            </div>
          ))}
        </div>
        
        {/* STL Collections Summary */}
        <div className="flex gap-6 mt-8 mb-3">
          <div className="w-1/2">
            <div className="w-full bg-[#F6BA12] p-2 rounded-md grid grid-cols-1 md:grid-cols-2 items-center gap-2 text-left">
              <SkeletonBox height="h-4" width="w-32" />
              <div className="flex justify-center md:justify-end">
                <SkeletonBox height="h-6" width="w-20" />
              </div>
            </div>
          </div>
          <div className="w-1/2" />
        </div>
        {/* Left/Right columns with breakdowns */}
        <div className="flex flex-col md:flex-row gap-6">
          {[...Array(2)].map((_, colIdx) => (
            <div key={colIdx} className="w-full md:w-1/2 space-y-4">
              {[...Array(3)].map((_, secIdx) => (
                <div
                  key={secIdx}
                  className="bg-[#7A7766] p-4 rounded-lg shadow-sm animate-pulse space-y-2"
                >
                  <SkeletonBox height="h-4" width="w-1/2" />
                  <SkeletonBox height="h-4" width="w-3/4" />
                  <SkeletonBox height="h-4" width="w-2/3" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </AccessGuard>
  );
}
