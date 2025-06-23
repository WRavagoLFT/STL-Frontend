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
  gameCategoryMap,
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

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleAddGameCombinationSubmit = async (
    data: GameCombination
  ): Promise<void> => {
    try {
      const result = await addWinningCombination(data);

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "User added successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        setIsCreateModalOpen(false);
      } else {
        console.error("Failed to add user:", result.message);

        let htmlMessage = result.message || "Something went wrong.";

        if (result.errors && Array.isArray(result.errors)) {
          htmlMessage += `<ul class="text-left" style="margin-top: 10px;">`;
          for (const err of result.errors) {
            htmlMessage += `<li>• <strong>${err.field}</strong>: ${err.message}</li>`;
          }
          htmlMessage += `</ul>`;
        }

        Swal.fire({
          icon: "error",
          title: "Add Failed",
          text: result.message || "Something went wrong while adding the user.",
        });
      }
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
            className="bg-transparent border border-[#0038A8] rounded-sm p-5 lg:px-9 lg:py-7 flex items-center justify-center"
          >
            <p className="font-bold text-3xl lg:text-5xl">{number}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <React.Fragment>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:flex gap-4 lg:gap-6">
        <div className="flex flex-col flex-1">
          <p className="text-sm font-light mb-1">First Draw</p>
          {renderDrawNumbers(firstDraw)}
        </div>

        <div className="flex flex-col flex-1">
          <p className="text-sm font-light mb-1">Second Draw</p>
          {renderDrawNumbers(secondDraw)}
        </div>

        <div className="flex flex-col flex-1">
          <p className="text-sm font-light mb-1">Third Draw</p>
          {renderDrawNumbers(thirdDraw)}
        </div>
      </div>

      {currentUserType !== 3 && currentUserType !== 6 && (
        <div className="mt-5 w-full flex justify-center sm:justify-end">
          <button
            onClick={handleOpenModal}
            className="bg-[#0038A8] hover:bg-blue-700 text-sm text-white py-3 px-6 rounded-md w-full sm:w-auto"
          >
            Input Draw Combination
          </button>

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
