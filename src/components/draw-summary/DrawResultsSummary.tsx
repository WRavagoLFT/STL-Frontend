import React, { useEffect, useState } from "react";
import { useAuthStore } from "~/store/useAuthStore";
import AddGameCombinationModal from "./AddGameCobination";
import { fetchGameSchedule, fetchGameTypes } from "~/utils/api/gamecategories";
import { GameCombination } from "~/types/types";
import { addWinningCombination } from "~/utils/api/winningcombinations";
import Swal from "sweetalert2";

interface GameScheduleItem {
  GameScheduleID: number;
  GameScheduleName: string;
}

export interface GameType {
  GameTypeId: number; 
  GameType: string;
  GameCategoryId: number;
  GameScheduleId: number;
}

const DrawResultsSummaryPage = ({ 
  firstDraw, 
  secondDraw, 
  thirdDraw, 
  gameCategoryMap 
}: {
  firstDraw?: string[];
  secondDraw?: string[];
  thirdDraw?: string[];
  gameCategoryMap: Map<string, string>;
}) => {
  const currentUserType = useAuthStore((state) => state.userTypeId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gameSchedule, setGameSchedule] = useState<number | "">("");
  const [gameTypes, setGameTypes] = useState<GameType[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  useEffect(() => {
    async function loadData() {
      const gameSched = await fetchGameSchedule();
      if (gameSched.success) setGameSchedule(gameSched.data);

      const gameTypes = await fetchGameTypes();
      if (gameTypes.success) setGameTypes(gameTypes.data);
    }
    loadData();
  }, []);

  const gameScheduleOptions = Array.isArray(gameSchedule)
    ? gameSchedule.map((cat: GameScheduleItem) => ({
        value: cat.GameScheduleID,
        label: cat.GameScheduleName?.toString() || "",
      }))
    : [];

  //console.log('GAME SCHED', gameSchedule);
  //console.log('GAME CATEG IN THE COMPONENT:', gameCategoryMap);
  //console.log('GAME SCHED OPTIONS', gameScheduleOptions);
  //console.log('GAME TYPES', gameTypes);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleAddGameCombinationSubmit = async (data: GameCombination): Promise<void> => {
    try {
      console.log("Adding user:", data);
      const result = await addWinningCombination(data);

      if (result.success) {
        console.log("User added successfully:", result.data);

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "User added successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        console.error("Failed to add user:", result.message);
        Swal.fire({
          icon: "error",
          title: "Add Failed",
          text: result.message || "Something went wrong while adding the user.",
        });
      }

      setIsCreateModalOpen(false);
    } catch (error) {
      console.error(
        "Unexpected error in handleAddUser:",
        (error as Error).message
      );
      Swal.fire({
        icon: "error",
        title: "Unexpected Error",
        text: (error as Error).message || "An unexpected error occurred.",
      });
    }
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
          {renderDrawNumbers(firstDraw)}
        </div>

        <div className="flex flex-col">
          <p className="text-sm font-light mb-1">Second Draw</p>
          {renderDrawNumbers(secondDraw)}
        </div>

        <div className="flex flex-col">
          <p className="text-sm font-light mb-1">Third Draw</p>
          {renderDrawNumbers(thirdDraw)}
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
            onSubmit={handleAddGameCombinationSubmit}
            gameCategoryMap={gameCategoryMap}
            gameScheduleOptions={gameScheduleOptions}
            gameTypes={gameTypes}
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default DrawResultsSummaryPage;
