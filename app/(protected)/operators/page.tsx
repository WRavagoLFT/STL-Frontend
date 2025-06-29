import { AccessGuard } from "~/components/auth/AccessGuard";
import OperatorsPage from "~/components/operators/ParentOperator";

export default function Page() {
  return (
    <AccessGuard allowedUserTypes={[6]}>
      <OperatorsPage />
    </AccessGuard>
  );
}