import React, { useState, useEffect } from "react";
import { useOperatorsData } from "../../../store/useOperatorStore";
import DetailedTable from "~/components/ui/tables/DetailedTable";
import ChartsDataPage from "~/components/ui/charts/UserChartsData";
import { operatorTableColumns } from "~/config/operatorTableColumns";
import CardsPage from "~/components/user/CardsData";
import { Operator } from "~/types/types";
import { addOperator } from "~/utils/api/operators";
import { useOperatorFormStore } from "../../../store/useOperatorFormStore";
import { fetchGameCategories } from "~/utils/api/gamecategories";
import {
  fetchAreaOfOperations,
  fetchCities,
  fetchProvinces,
  fetchRegions,
} from "~/utils/api/location";
import { fetchOperators } from "~/utils/api/operators";
import Swal from "sweetalert2";
import { AccessGuard } from "~/components/auth/AccessGuard";
import AddOperatorPage from "../operators-add";
  
const OperatorsPage = () => {
  const { data, setData } = useOperatorsData();
  const textlabel = "Operators";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const tableColumns = operatorTableColumns();

  const dashboardData = data.map((op) => ({
    ...op,
    region: op.OperatorRegion?.RegionName ?? "Unknown",
  }));

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gameTypesResponse = await fetchGameCategories();
        const regions = await fetchRegions();
        const provinces = await fetchProvinces();
        const cities = await fetchCities({ availableOnly: true });
        const areaOfOperations = await fetchAreaOfOperations();
        const operators = await fetchOperators();

        // Set into Zustand store
        setGameTypes(gameTypesResponse.data);
        setRegions(regions.data);
        setProvinces(provinces.data);
        setCities(cities.data);
        setAreaOfOperations(areaOfOperations.data);
        setData(operators.data);

        //console.log("Fetched and set game types:", gameTypes);
        //console.log("Fetched and set regions:", regions);
        //console.log("Fetched and set provinces:", provinces);
        //console.log("Fetched and set cities:", cities);
        //console.log("Fetched and set area of operations:", areaOfOperations);
        //console.log("Fetched and set operators:", operators);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddOperator = async (data: Operator): Promise<void> => {
    try {
      //console.log("Adding operator:", data);

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
      } else {
        console.error("Failed to add operator:", result.message);
        Swal.fire({
          icon: "error",
          title: "Add Failed",
          text:
            result.message || "Something went wrong while adding the operator.",
        });
      }

      setIsModalOpen(false);
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
    <AccessGuard allowedUserTypes={[6]}>
      <div className="mx-auto px-0 py-1">
        <h1 className="text-3xl font-bold mb-3">Small Town Lottery Operators</h1>
        <CardsPage 
          dashboardData={data}
          textlabel={textlabel}
        />
        
        <ChartsDataPage
          userType="operator"
          pageType="operator"
          dashboardData={dashboardData}
        />
        
        <DetailedTable
          data={data}
          columns={tableColumns}
          pageType="operator"
          source="operators"
          onAddClick={openModal}
        />
      </div>
    </AccessGuard>
  );
};

export default OperatorsPage;