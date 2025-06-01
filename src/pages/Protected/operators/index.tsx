import React, { useEffect } from "react";
import DetailedTable from "~/components/ui/tables/DetailedTable";
import ChartsDataPage from "~/components/ui/charts/UserChartsData";
import { operatorTableColumns } from "~/config/operatorTableColumns";
import CardsPage from "~/components/user/CardsData";
import { fetchOperators } from "~/utils/api/operators";
import { AccessGuard } from "~/components/auth/AccessGuard";
import router from "next/router";
import { fetchGameCategories } from "~/utils/api/gamecategories";
import {
  fetchAreaOfOperations,
  fetchCities,
  fetchProvinces,
  fetchRegions,
} from "~/utils/api/location";
import { useOperatorFormStore } from "~/store/useOperatorFormStore";

export const fetchFormOptionsData = async () => {
  try {
    const {
      setGameTypes,
      setRegions,
      setProvinces,
      setCities,
      setAreaOfOperations,
      setData,
    } = useOperatorFormStore.getState();

    const gameTypesResponse = await fetchGameCategories();
    const regionsRes = await fetchRegions();
    const provincesRes = await fetchProvinces();
    const citiesRes = await fetchCities({ availableOnly: true });
    const areaOpsRes = await fetchAreaOfOperations();
    const operators = await fetchOperators();

    setData(operators.data);
    setGameTypes(gameTypesResponse.data);
    setRegions(regionsRes.data);
    setProvinces(provincesRes.data);
    setCities(citiesRes.data);
    setAreaOfOperations(areaOpsRes.data);
  } catch (error) {
    console.error("Error fetching form options:", error);
  }
};

const OperatorsPage = () => {
  const { data } = useOperatorFormStore();
  const textlabel = "Operators";
  const tableColumns = operatorTableColumns();

  const dashboardData = data.map((op) => ({
    ...op,
    region: op.OperatorRegion?.RegionName ?? "Unknown",
  }));

  useEffect(() => {
    fetchFormOptionsData();
  }, []);

  return (
    <AccessGuard allowedUserTypes={[6]}>
      <div className="mx-auto px-0 py-1">
        <h1 className="text-3xl font-bold mb-3">
          Small Town Lottery Operators
        </h1>
        <CardsPage dashboardData={data} textlabel={textlabel} />
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
          onAddClick={() => router.push("/operators/operators-add")}
        />
      </div>
    </AccessGuard>
  );
};

export default OperatorsPage;
