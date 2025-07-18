"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchOperatorById } from "@/services/userService";
import { AccessGuard } from "@/components/auth/AccessGuard";
import OperatorsView from "@/components/operators/OperatorsView";

export default function OperatorSlugClientPage() {
  const { slug } = useParams();
  const [operator, setOperator] = useState(null);

  useEffect(() => {
    if (!slug || typeof slug !== "string") return;
    const id = Number(slug.split("-")[0]);
    if (isNaN(id)) return;

    fetchOperatorById(id).then(setOperator);
  }, [slug]);

  if (!operator) return <div>Loading...</div>;

  return (
    <AccessGuard allowedUserTypes={[6]}>
      <OperatorsView operator={operator} slug={slug as string} />
    </AccessGuard>
  );
}
