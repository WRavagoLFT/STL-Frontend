import React, { Suspense, useEffect, useState } from "react";
import DetailedTable from "~/components/ui/tables/DetailedTable";
import ChartsDataPage from "~/components/ui/charts/UserChartsData";
import { operatorTableColumns } from "~/config/operatorTableColumns";
import CardsPage from "~/components/user/CardsData";
import { AccessGuard } from "~/components/auth/AccessGuard";
import router from "next/router";
import { useOperatorFormStore } from "~/store/useOperatorFormStore";
import { fetchFormOptionsData } from "~/hooks/userLoadOperators";
import { UsersSkeletonPage } from "~/components/user/UsersSkeleton";
import { fetchGameCategories } from "~/utils/api/gamecategories";

const OperatorsPage = () => {
  const { data } = useOperatorFormStore();
  const textlabel = "Operators";
  const tableColumns = operatorTableColumns();
  const [hasFetched, setHasFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const dashboardData = data.map((op) => ({
    ...op,
    region: op.OperatorRegion?.RegionName ?? "Unknown",
  }));

  useEffect(() => {
    const loadFormOptions = async () => {
      setLoading(true); // Start loading
      await fetchFormOptionsData();
      setHasFetched(true);
      setLoading(false); // End loading
    };

    if (!hasFetched) {
      loadFormOptions();
    }
  }, [hasFetched]);

  return (
    <AccessGuard allowedUserTypes={[6]}>
      {loading ? (
        <UsersSkeletonPage />
      ) : (
        <Suspense fallback={<UsersSkeletonPage />}>
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
        </Suspense>
      )}
    </AccessGuard>
  );
};

export default OperatorsPage;
