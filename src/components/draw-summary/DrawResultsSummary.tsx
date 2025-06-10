import React, { useState } from "react";
import { useAuthStore } from "~/store/useAuthStore";
import AddGameCombinationModal from "./AddGameCobination";

const DrawResultsSummaryPage = (data: {
  firstDraw?: string[];
  secondDraw?: string[];
  thirdDraw?: string[];
}) => {
  const currentUserType = useAuthStore((state) => state.userTypeId);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = (data: any) => {
    // Replace `any` with `User` if you have strict typing
    console.log("Submitted combination:", data);
    handleCloseModal(); // close modal after submission
  };

  const renderDrawNumbers = (drawData?: string[]) => {
    if (!drawData || drawData.length === 0) {
      return <p className="text-gray-500 italic">No Data</p>;
    }

    return (
      <div className="grid grid-cols-2 gap-2">
        {drawData.map((number, index) => (
          <div
            key={index}
            className="bg-transparent border border-[#0038A8] rounded-sm p-5 md:px-9 md:py-7 flex items-center justify-center"
          >
            <p className="font-bold text-3xl lg:text-5xl">{number}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <React.Fragment>
      <div className="flex flex-col md:flex-row gap-6 flex-wrap md:space-x-6 md:items-stretch md:[&>div]:flex-1">
        <div className="flex flex-col">
          <p className="text-sm font-light mb-1">First Draw</p>
          {renderDrawNumbers(data.firstDraw)}
        </div>

        <div className="flex flex-col">
          <p className="text-sm font-light mb-1">Second Draw</p>
          {renderDrawNumbers(data.secondDraw)}
        </div>

        <div className="flex flex-col">
          <p className="text-sm font-light mb-1">Third Draw</p>
          {renderDrawNumbers(data.thirdDraw)}
        </div>
      </div>

      {currentUserType !== 3 && (
        <div>
          <div className="w-full flex justify-end mt-5">
            <button
              onClick={handleOpenModal}
              className="bg-[#0038A8] hover:bg-blue-700 text-sm text-white py-3 px-6 rounded-md"
            >
              Input Draw Combination
            </button>
          </div>

          {/* Modal */}
          <AddGameCombinationModal
            open={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default DrawResultsSummaryPage;
