import React, { useEffect, useState } from "react";
import OperatorViewPage from "~/components/operators/OperatorView";
import { useOperatorFormStore } from "../../../store/useOperatorFormStore";
import { useOperatorsData } from "../../../store/useOperatorStore";
import { operatorSchema } from "~/schemas/operatorSchema";
import { Operator } from "~/types/types";
import RetailReceiptOperatorsPage from "~/components/operators/RetailReceipts";
import BackIconButton from "~/components/ui/icons/BackButton";
import router from "next/router";
import { fetchGameCategories } from "~/utils/api/gamecategories";
import {
  fetchAreaOfOperations,
  fetchCities,
  fetchProvinces,
  fetchRegions,
} from "~/utils/api/location";
import { editLogOperator } from "~/utils/api/operators";
import EditModalPage from "~/components/ui/modals/EditLogModalWrapper";
import { operatorEditColumns } from "~/config/operatorEditLogTableColumns";

export interface OperatorViewPageProps {
  slug: string;
  operator: Operator;
}

const OperatorsView: React.FC<OperatorViewPageProps> = ({ slug, operator }) => {
  const [showEditLog, setShowEditLog] = useState(false);
  const editLogtableColumns = operatorEditColumns();
  const initialUserOperatorData = operator?.data;
  const [selectedOperatorId, setSelectedOperatorId] = useState<number | null>(
    null
  );

  const handleViewEditLogs = (operatorId: number) => {
    setSelectedOperatorId(operatorId); // save the operatorId you want to view
    setShowEditLog(true); // then open modal
  };

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
        //const operators = await fetchOperators();

        // Set into Zustand store
        setGameTypes(gameTypesResponse.data);
        setRegions(regions.data);
        setProvinces(provinces.data);
        setCities(cities.data);
        setAreaOfOperations(areaOfOperations.data);
        //setData(operators.data);

        //console.log("Fetched and set game types:", gameTypes);
        //console.log("Fetched and set regions:", regions);
        //console.log("Fetched and set provinces:", provinces);
        //console.log("Fetched and set cities:", cities);
        //console.log("Fetched and set area of operations:", areaOfOperations);
        //console.log('fetched operators:', operators)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  console.log("operatorrr console", operator);

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
          {operator?.data.OperatorName || "N/A"}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:gap-x-8 gap-y-4 w-full mt-1">
        {/* Left side - Operator View */}
        <div className="flex flex-col w-full md:w-3/5">
          <OperatorViewPage
            initialUserOperatorData={operator}
            gameTypes={gameTypes}
            provinces={provinces}
            regions={regions}
            cities={cities}
            areaofoperations={areaOfOperations}
            schema={operatorSchema}
            isOpen={true}
            onClose={() => router.push("/operators")}
            onViewEditLogs={(operatorId) => handleViewEditLogs(operatorId)}
          />

          {selectedOperatorId !== null && showEditLog && (
            <>
              {console.log(
                "Opening EditModalPage with OperatorId:",
                selectedOperatorId
              )}

              <EditModalPage
                open={showEditLog}
                id={selectedOperatorId}
                fetchData={editLogOperator}
                columns={editLogtableColumns}
                onClose={() => setShowEditLog(false)}
              />
            </>
          )}
        </div>

        {/* Right side - Retail Receipt */}
        <div className="flex flex-col w-full md:w-2/5 min-w-0">
          <RetailReceiptOperatorsPage operatorId={operator?.data.OperatorId} />
        </div>
      </div>
    </div>
  );
};

export default OperatorsView;
