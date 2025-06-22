"use client";

import React from "react";
import { useAuthStore } from "~/store/useAuthStore";
import { LoginSectionData } from "~/data/LoginSectionData";
import { useRouter } from "next/navigation";

const Error404Page = () => {
  const router = useRouter();
  const currentUserType = useAuthStore((state) => state.userTypeId);
  console.log("CURRENT USER TYPE", currentUserType);

  const handleRedirect = () => {
    let targetPath = "";

    switch (currentUserType) {
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
    <div className="bg-[#F8F0E3]">
      <div className="container mx-auto flex items-center gap-4 mt-8">
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

      <div className="mt-40">
        <div className="flex justify-center items-center">
          <div className="text-center">
            <div className="font-bold text-5xl">
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
              {currentUserType ? "Return to Home Page" : "Return to Login Page"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error404Page;
