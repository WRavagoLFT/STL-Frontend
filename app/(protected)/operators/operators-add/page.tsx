import { AccessGuard } from "~/components/auth/AccessGuard";
import ParentAddOperator from "~/components/operators/ParentAddOperator";

export default function Page() {
  return (
    <AccessGuard allowedUserTypes={[6]}>
      <ParentAddOperator />
    </AccessGuard>
  );
}
  