import React from "react";
import ModalWrapper from "../ui/modals/ModalWrapper";
import { GameCombination } from "~/types/types";
import AddGameCombinationForm from "./AddGameCombinationForm";

type AddGameCombinationModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: GameCombination) => void;
  gameCategoryMap: Map<string, string>;
  gameScheduleOptions: { value: number; label: string; }[]; // Change from 'number | undefined' to 'string'
  gameTypes: {
    GameTypeId: number;
    GameType: string;
    GameCategoryId: number;
    GameScheduleId: number;
  }[];
};

export default function AddGameCombinationModal({ open, onClose, onSubmit, gameCategoryMap, gameScheduleOptions, gameTypes }: AddGameCombinationModalProps) {
  const title = "Input Draw Combination";

  return (
    <ModalWrapper isOpen={open} onClose={onClose} title={title}>
      <AddGameCombinationForm 
        onClose={onClose}
        onSubmit={onSubmit}
        gameCategoryMap={gameCategoryMap}
        gameScheduleOptions={gameScheduleOptions}
        gameTypes={gameTypes}
       />
    </ModalWrapper>
  );
}
