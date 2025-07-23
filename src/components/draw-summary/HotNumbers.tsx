import React from "react";

interface HotNumberPageProps {
  number: string;
  loading?: boolean;
}

const HotNumberPage: React.FC<HotNumberPageProps> = ({ number, loading }) => {
  return (
    <div className="flex gap-3 mt-5">
      <div>
        {loading ? (
          <>
            <div className="h-4 w-24 bg-gray-200 rounded mb-1 animate-pulse" />
            <div className="flex gap-2">
              <div className="bg-gray-200 rounded-md px-10 py-8 flex items-center justify-center animate-pulse w-[130px] h-[80px]" />
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-[#CE1126] font-light mb-1">Hot Number</p>
            <div className="flex gap-2">
              <div className="bg-[#CE1126] rounded-md px-10 py-8 flex items-center justify-center">
                <p className="text-white font-bold text-3xl lg:text-5xl">{number}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HotNumberPage;
