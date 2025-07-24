import { AccessGuard } from "@/components/auth/AccessGuard";
import { ParentRetailReceipt } from "@/components/retail-receipts/ParentRetailReceipts";
import RetailReceiptSkeleton from "@/components/retail-receipts/RetailReceiptSkeleton";
import { Suspense } from "react";

export default function Page() {
  return (
    <AccessGuard allowedUserTypes={[4, 6]}>
      <Suspense fallback={<div><RetailReceiptSkeleton /></div>}>
        <ParentRetailReceipt />
      </Suspense>
    </AccessGuard>
  );
}

