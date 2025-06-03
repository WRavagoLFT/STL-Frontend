import React from "react";
import { Operator } from "~/types/types";
import AddOperatorForm from "./AddOperatorForm";

type AddOperatorPageProps = {
  open?: boolean;
  onClose?: () => void;
  onSubmit: (data: Operator) => void;
  gameTypes: any[];
  regions: any[];
  provinces: any[];
  cities: any[];
  areaOfOperations: any;
};

export default function AddOperatorPage({
  open,
  onClose,
  onSubmit,
  gameTypes,
  regions,
  provinces,
  cities,
  areaOfOperations,
}: AddOperatorPageProps) {
  return (
    <AddOperatorForm
      onSubmit={onSubmit}
      gameTypes={gameTypes}
      regions={regions}
      provinces={provinces}
      cities={cities}
      areaOfOperations={areaOfOperations}
      onClose={onClose}
    />
  );
}
