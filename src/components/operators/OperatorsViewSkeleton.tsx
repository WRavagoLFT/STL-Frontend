import Skeleton from "@mui/material/Skeleton";
import React from "react";

export const OperatorsViewSkeletonPage: React.FC = () => {

    return (
        <div className="w-full flex flex-col gap-4 animate-pulse">
            {/* Header section with back button and title */}
            <div className="flex items-center space-x-4">
                <div className="w-[30px] h-[30px] bg-gray-300 rounded-full" />
                <div className="h-8 bg-gray-300 rounded w-1/5" />
            </div>

            {/* Main content layout */}
            <div className="flex flex-col md:flex-row md:gap-x-8 gap-y-4 w-full mt-1">
                {/* Left column (OperatorViewPage Skeleton) */}
                <div className="flex flex-col w-full md:w-3/5 space-y-4">
                    {/* Mock form fields */}
                    <div className="space-y-3">
                        <Skeleton className="h-20 w-48" />
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                        </div>
                        <div className="w-full flex justify-end mt-3">
                            <Skeleton className="h-9 w-40" />
                        </div>
                    </div>

                    {/* Owner Information */}
                    <div className="mt-5 space-y-3">
                        <Skeleton className="h-20 w-48" />
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-16 col-span-2 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                        </div>
                    </div>

                    {/* AAC Information */}
                    <div className="mt-5 space-y-3">
                        <Skeleton className="h-20 w-48" />
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 col-span-2 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                        </div>
                    </div>

                    {/* Remarks */}
                    <div className="col-span-2 my-4">
                        <Skeleton className="h-16 w-full" />
                    </div>

                    {/* Placeholder for Edit Logs modal trigger */}
                    <div className="h-8 bg-gray-200 rounded w-full mt-4" />
                </div>

                {/* Right column (RetailReceiptOperatorsPage Skeleton) */}
                <div className="flex flex-col w-full md:w-2/5 min-w-0 space-y-3">
                    <div className="space-y-3">
                        <Skeleton className="h-20 w-48" />
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                        </div>
                    </div>
                    <Skeleton className="h-20 w-48" />
                    <div className="h-12 bg-gray-300 rounded" />
                    <Skeleton className="h-20 w-48" />
                    <div className="h-12 bg-gray-300 rounded" />
                    <div className="h-12 bg-gray-300 rounded" />
                    <div className="h-12 bg-gray-300 rounded" />
                    <Skeleton className="h-20 w-48" />
                    <div className="h-12 bg-gray-300 rounded" />
                    <div className="h-12 bg-gray-300 rounded" />
                    <div className="h-12 bg-gray-300 rounded" />
                </div>
            </div>
        </div>
    );
};
