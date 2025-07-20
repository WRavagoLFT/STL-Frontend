"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DetailedTable from "@/components/ui/tables/DetailedTable";
import ChartsDataPage from "@/components/ui/charts/UserChartsData";
import { operatorTableColumns } from "@/config/operatorTableColumns";
import CardsPage from "@/components/user/CardsData";
import { useOperatorFormStore } from "@/store/useOperatorFormStore";
import { fetchFormOptionsData, fetchOperatorsData } from "@/hooks/userLoadOperators";
import { UsersSkeletonPage } from "@/components/user/UsersSkeleton";

const OperatorsPage = () => {
  const { data } = useOperatorFormStore();
  const router = useRouter();
  const textlabel = "Operators";
  const tableColumns = operatorTableColumns();
  const [hasFetched, setHasFetched] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadFormOptions = useCallback(async () => {
    setLoading(true);
    await fetchFormOptionsData();
    setHasFetched(true);
    setLoading(false);
  }, []);

  const loadOperators = useCallback(async () => {
    await fetchOperatorsData();
  }, []);

  // Form options fetch
  useEffect(() => {
    if (!hasFetched) {
      loadFormOptions();
    }
  }, [hasFetched, loadFormOptions]);

  // Operators fetch
  useEffect(() => {
    if (hasFetched) {
      loadOperators();
    }
  }, [hasFetched, loadOperators]);

  //console.log(data);

  return (
    <Suspense fallback={<UsersSkeletonPage />}>
      <div className="mx-auto px-0 py-1">
        <h1 className="text-3xl font-bold mb-3">
          Small Town Lottery Operators
        </h1>

        <CardsPage 
          dashboardData={data.map((op) => ({
            LastLogin: op.LastLogin ?? undefined,
            LastTokenRefresh: op.LastTokenRefresh ?? undefined,
            UserStatusId: op.UserStatusId ?? undefined,
            DateOfRegistration: op.DateOfOperation ?? undefined,
            IsActive: op.Status ?? undefined,
          }))}
          textlabel={textlabel}
          loading={loading}
        />

        <ChartsDataPage
          userType="operator"
          pageType="operator"
          dashboardData={data.map((op) => ({
            LastLogin: op.LastLogin ?? undefined,
            LastTokenRefresh: op.LastTokenRefresh ?? undefined,
            UserStatusId: op.UserStatusId ?? undefined,
            DateOfRegistration: op.DateOfOperation ?? "",
            IsActive: op.Status ?? 0,
            region: typeof op.Region === "object"
              ? op.Region.RegionName 
              : "Unknown",
            OperatorName: op.OperatorName,
            BranchRegion: Number(op.BranchRegion) || undefined,
            OperatorRegion: typeof op.Region === "object"
              ? op.Region 
              : undefined,
          }))}
          loading={loading}
        />

        <DetailedTable
          data={data}
          columns={tableColumns}
          pageType="operator"
          source="operators"
          loading={loading}
          onAddClick={() => router.push("/operators/operators-add")}
        />
      </div>
    </Suspense>
  );
};

export default OperatorsPage;
