import React from "react";
import ModalWrapper from "../ui/modals/ModalWrapper";
import { Operator } from "~/types/types";
import AddOperatorForm from "./AddOperatorForm";

type AddOperatorModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Operator) => void;
  gameTypes: any[];
  regions: any[];
  provinces: any[];
  cities: any[];
  areaOfOperations: any;
};

export default function AddOperatorModal({
  open,
  onClose,
  onSubmit,
  gameTypes,
  regions,
  provinces,
  cities,
  areaOfOperations,
}: AddOperatorModalProps) {
  return (
    <ModalWrapper isOpen={open} onClose={onClose} title="Add Operator">
      <AddOperatorForm 
        onSubmit={onSubmit}
        gameTypes={gameTypes}
        regions={regions}
        provinces={provinces}
        cities={cities}
        areaOfOperations={areaOfOperations}
      />
    </ModalWrapper>
  );
}
