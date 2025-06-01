import router from "next/router";
import React, { useEffect } from "react";
import Swal from "sweetalert2";
import AddOperatorPage from "~/components/operators/AddOperator";
import BackIconButton from "~/components/ui/icons/BackButton";
import { useOperatorFormStore } from "~/store/useOperatorFormStore";
import { useOperatorsData } from "~/store/useOperatorStore";
import { Operator } from "~/types/types";
import { fetchGameCategories } from "~/utils/api/gamecategories";
import {
  fetchAreaOfOperations,
  fetchCities,
  fetchProvinces,
  fetchRegions,
} from "~/utils/api/location";
import { addOperator, fetchOperators } from "~/utils/api/operators";

export default function AddOperator() {
  const {
    gameTypes,
    regions,
    provinces,
    cities,
    areaOfOperations,
    setGameTypes,
    setRegions,
    setProvinces,
    setCities,
    setAreaOfOperations,
  } = useOperatorFormStore();

  const { data, setData } = useOperatorsData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gameTypesResponse = await fetchGameCategories();
        const regions = await fetchRegions();
        const provinces = await fetchProvinces();
        const cities = await fetchCities({ availableOnly: true });
        const areaOfOperations = await fetchAreaOfOperations();
        const operators = await fetchOperators();

        setGameTypes(gameTypesResponse.data);
        setRegions(regions.data);
        setProvinces(provinces.data);
        setCities(cities.data);
        setAreaOfOperations(areaOfOperations.data);
        setData(operators.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddOperator = async (data: Operator): Promise<void> => {
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
