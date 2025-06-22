"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DetailedTable from "~/components/ui/tables/DetailedTable";
import ChartsDataPage from "~/components/ui/charts/UserChartsData";
import { operatorTableColumns } from "~/config/operatorTableColumns";
import CardsPage from "~/components/user/CardsData";
import { AccessGuard } from "~/components/auth/AccessGuard";
import { useOperatorFormStore } from "~/store/useOperatorFormStore";
import { fetchFormOptionsData } from "~/hooks/userLoadOperators";
import { UsersSkeletonPage } from "~/components/user/UsersSkeleton";

const OperatorsPage = () => {
  const { data } = useOperatorFormStore();
  const router = useRouter();
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
      setLoading(true);
      await fetchFormOptionsData();
      setHasFetched(true);
      setLoading(false);
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
            onAddClick={() => router.push("/protected/operators/operators-add")}
          />
        </div>
      )}
    </AccessGuard>
  );
};

export default OperatorsPage;
