import React from "react";
import ModalWrapper from "../ui/modals/ModalWrapper";
import { GameCombination } from "~/types/types";
import AddGameCombinationForm from "./AddGameCombinationForm";

type AddGameCombinationModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: GameCombination) => void;
};

export default function AddGameCombinationModal({ open, onClose, onSubmit }: AddGameCombinationModalProps) {
  const title = "Input Draw Combination";

  return (
    <ModalWrapper isOpen={open} onClose={onClose} title={title}>
      <AddGameCombinationForm 
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </ModalWrapper>
  );
}
