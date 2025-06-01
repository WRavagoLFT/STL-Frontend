import React, { useEffect } from "react";
import { useOperatorsData } from "../../../store/useOperatorStore";
import DetailedTable from "~/components/ui/tables/DetailedTable";
import ChartsDataPage from "~/components/ui/charts/UserChartsData";
import { operatorTableColumns } from "~/config/operatorTableColumns";
import CardsPage from "~/components/user/CardsData";
import { fetchOperators } from "~/utils/api/operators";
import { AccessGuard } from "~/components/auth/AccessGuard";
import router from "next/router";
  
const OperatorsPage = () => {
  const { data, setData } = useOperatorsData();
  const textlabel = "Operators";
  const tableColumns = operatorTableColumns();

  const dashboardData = data.map((op) => ({
    ...op,
    region: op.OperatorRegion?.RegionName ?? "Unknown",
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const operators = await fetchOperators();

        // Set into Zustand store
        setData(operators.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
          onAddClick={() => router.push("/operators/operators-add")}
        />
      </div>
    </AccessGuard>
  );
};

export default OperatorsPage;