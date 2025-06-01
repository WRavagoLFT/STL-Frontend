import React, { Suspense } from "react";
import { AccessGuard } from "~/components/auth/AccessGuard";
import Card from "~/components/ui/dashboardcards/Cards";
import DetailedTable from "~/components/ui/tables/DetailedTable";

const DeviceInformationPage = () => {
  return (
    <AccessGuard allowedUserTypes={[1, 2, 3, 4, 5, 6]}>
      <div className="space-y-3 h-full">
        <h1 className="text-3xl font-bold">Device Information</h1>
        <div className="flex flex-wrap gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card
              key={index}
              label={`Card ${index + 1}`}
              value={undefined} // Replace with actual value
            />
          ))}
        </div>
        <div className="">
          <DetailedTable data={[]} columns={[]} pageType="Device Information"/>
        </div>
      </div>
    </AccessGuard>
  );
};

export default DeviceInformationPage;
