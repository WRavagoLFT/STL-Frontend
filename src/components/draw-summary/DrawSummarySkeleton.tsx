import React from "react";

const DrawSummarySkeletonPage = () => {
    return (
        <div className="flex flex-col gap-4 animate-pulse">
            {/* Title */}
            <div className="h-8 w-1/3 bg-gray-300 rounded" />

            {/* Select Filters (4 items in a grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                        <div className="h-4 w-1/3 bg-gray-300 rounded" /> {/* Label */}
                        <div className="h-12 w-full bg-gray-200 rounded" /> {/* Select */}
                    </div>
                ))}
            </div>

            {/* Main content layout (Left + Right columns) */}
            <div className="flex flex-col lg:flex-row w-full gap-6 lg:gap-12 mt-4">
                {/* Left Column (2/3 width) */}
                <div className="flex flex-col gap-4 w-full lg:w-2/3">
                    {/* Province + Game Category Heading */}
                    <div className="h-6 w-1/2 bg-gray-300 rounded" />

                    {/* Draw Results section */}
                    <div>
                        <div className="h-4 w-1/4 bg-gray-300 rounded mb-2" /> {/* "Draw Results" */}

                        {/* Simulated Draw result layout (skeleton version) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:flex gap-4 lg:gap-6 animate-pulse">
                            {[...Array(3)].map((_, drawIdx) => (
                                <div key={drawIdx} className="flex flex-col flex-1">
                                    {/* Label Skeleton */}
                                    <div className="h-4 w-1/3 bg-gray-300 rounded mb-1" />

                                    {/* Number boxes grid */}
                                    <div className="grid grid-cols-2 gap-2">
                                        {[...Array(2)].map((_, numIdx) => (
                                            <div
                                                key={numIdx}
                                                className="bg-gray-200 rounded-sm p-5 mt-2 lg:px-16 lg:py-16 flex items-center justify-center"
                                            >
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Hot & Cold Numbers */}
                        <div className="flex gap-6 mt-6">
                            {/* Hot Numbers */}
                            <div className="flex flex-col items-start">
                                <div className="h-4 w-24 bg-gray-300 rounded mb-2" /> {/* Label */}
                                <div className="h-32 w-40 bg-gray-200 rounded" />       {/* Box */}
                            </div>

                            {/* Cold Numbers */}
                            <div className="flex flex-col items-start">
                                <div className="h-4 w-24 bg-gray-300 rounded mb-2" /> {/* Label */}
                                <div className="h-32 w-40 bg-gray-200 rounded" />       {/* Box */}
                            </div>
                        </div>


                        {/* Frequency table */}
                        <div className="flex gap-2 mt-5">
                            <div className="h-96 w-full bg-gray-200 rounded" />
                        </div>
                    </div>
                </div>

                {/* Right Column (1/3 width) */}
                <div className="flex flex-col gap-4 w-full lg:w-1/3">
                    <div className="h-6 w-2/3 bg-gray-300 rounded" /> {/* "Draw List Summary" */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, idx) => (
                            <div
                                key={idx}
                                className="animate-pulse bg-gray-200 py-5 px-3 rounded-xl text-white w-full text-center min-h-[760px]" // height adjusted
                            >
                                <div className="h-4 w-20 mx-auto bg-gray-300 rounded mb-2" />
                                <div className="w-full h-[2px] bg-gray-400 opacity-100 my-2" />
                                <div className="mt-6 space-y-4">
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DrawSummarySkeletonPage;
