"use client";

import router, { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Swal from "sweetalert2";
import AddOperatorPage from "@/components/operators/AddOperator";
import BackIconButton from "@/components/ui/icons/BackButton";
import { fetchFormOptionsData } from "@/hooks/userLoadOperators";
import { addOperator, AddOperatorPayload, fetchOperators } from "@/lib/api/operators/operators.service";
import { useOperatorFormStore } from "@/store/useOperatorFormStore";

export default function ParentAddOperator() {
  const {
    gameTypes,
    regions,
    provinces,
    cities,
    areaOfOperations,
  } = useOperatorFormStore();
  const { data, setData } = useOperatorFormStore();
  const router = useRouter();
  
  useEffect(() => {
    fetchFormOptionsData();
  }, []);

  const handleAddOperator = async (data: AddOperatorPayload): Promise<void> => {
    try {
      const result = await addOperator(data);
      if (result.success) {
        const operatorsResult = await fetchOperators();
        setData(operatorsResult?.data ?? []);

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Operator added successfully.",
          timer: 2000,
          showConfirmButton: false,
        });

        router.push("/operators");
      } else {
        console.error("Failed to add operator:", result.message);
        Swal.fire({
          icon: "error",
          title: "Add Failed",
          text:
            result.message || "Something went wrong while adding the operator.",
        });
      }
    } catch (error) {
      console.error(
        "Unexpected error in handleAddOperator:",
        (error as Error).message
      );
      Swal.fire({
        icon: "error",
        title: "Unexpected Error",
        text: (error as Error).message || "An unexpected error occurred.",
      });
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center space-x-4">
        <BackIconButton
          to="/operators"
          bgColor="#0038A8"
          hoverColor="#004ccf"
          iconColor="#fff"
          size={30}
          onClick={() => {
            router.push("/operators");
          }}
        />
        <div className="text-2xl md:text-3xl font-bold truncate">
          Add Operator
        </div>
      </div>
      <AddOperatorPage
        onSubmit={handleAddOperator}
        gameTypes={gameTypes}
        regions={regions}
        provinces={provinces}
        cities={cities}
        areaOfOperations={areaOfOperations}
      />
    </div>
  );
}
