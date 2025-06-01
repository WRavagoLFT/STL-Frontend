import React from "react";
import AddOperatorForm from "~/components/operators/AddOperatorForm";
import { Operator } from "~/types/types";

type AddOperatorPageProps = {
  onSubmit: (data: Operator) => void;
  gameTypes: any[];
  regions: any[];
  provinces: any[];
  cities: any[];
  areaOfOperations: any;
};

export default function AddOperatorPage({
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
    />
  );
}
