"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { LoginSectionData } from "@/data/LoginSectionData";

const Error404Page = () => {
  const router = useRouter();

  // Use selector to access just what you need
  const userTypeId = useAuthStore((state) => state.user?.UserTypeId ?? null);
  console.log('USERTYPE ID', userTypeId);

  const handleRedirect = () => {
    let targetPath = "/";

    switch (userTypeId) {
      case 3:
      case 4:
      case 6:
        targetPath = "/dashboard";
        break;
      case 5:
        targetPath = "/draw-summary";
        break;
      default:
        targetPath = "/";
        break;
    }

    router.push(targetPath);
  };

  return (
    <div className="bg-[#F8F0E3] min-h-screen">
      {/* Header with Logo */}
      <div className="container mx-auto flex items-center gap-4 pt-8 px-4">
        <img
          src={LoginSectionData.image2}
          alt="PCSO Logo"
          className="w-[60px] h-[60px] object-contain"
          loading="lazy"
        />
        <div>
          <div className="font-bold leading-none">
            Philippine Charity Sweepstakes Office
          </div>
          <div className="text-medium">PCSO Hindi Umuurong sa Pagtulong</div>
        </div>
      </div>

      {/* Error Message */}
      <div className="flex justify-center items-center py-32 px-4">
          <div className="text-center">
            <div className="font-bold text-5xl text-blue-800">
              Oops! The page you’re <br />
              looking for doesn’t exist.
            </div>
            <div className="text-xl mt-2">
              It might have been moved, deleted, or never existed at all.
            </div>

            <button
              onClick={handleRedirect}
              className={`
                mt-4
                w-full
                rounded-lg
                px-6
                py-2
                text-sm
                text-[#212121]
                bg-[#F6BA12]
                hover:bg-[#FFD100]
                ease-in-out
              `}
            >
              {userTypeId ? "Return to Home Page" : "Return to Login Page"}
            </button>
          </div>
      </div>
    </div>
  );
};

export default Error404Page;
