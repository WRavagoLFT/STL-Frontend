import { AccessGuard } from "~/components/auth/AccessGuard";
import { ParentRetailReceipt } from "~/components/retail-receipts/ParentRetailReceipts";

export default function Page() {
  return (
    <AccessGuard allowedUserTypes={[4, 6]}>
      <ParentRetailReceipt />
    </AccessGuard>
  );
}

