import React from "react";
import AddOperatorForm from "./AddOperatorForm";
import { AddOperatorPayload } from "@/lib/api/operators/operators.service";

type AddOperatorPageProps = {
  onClose?: () => void;
  onSubmit: (data: AddOperatorPayload) => void;
  gameTypes: any[];
  regions: any[];
  provinces: any[];
  cities: any[];
  areaOfOperations: any;
};

export default function AddOperatorPage({
  onClose,
  onSubmit,
  gameTypes,
  regions,
  provinces,
  cities,
  areaOfOperations,
}: AddOperatorPageProps) {
  return (
    <div className="pb-40">
      <AddOperatorForm
        onSubmit={onSubmit}
        gameTypes={gameTypes}
        regions={regions}
        provinces={provinces}
        cities={cities}
        areaOfOperations={areaOfOperations}
        onClose={onClose}
      />
    </div>
  );
}
