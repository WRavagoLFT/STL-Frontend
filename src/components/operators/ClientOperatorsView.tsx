"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchOperatorById } from "@/services/userService";
import OperatorsView from "@/components/operators/OperatorsView";
import { OperatorsViewSkeletonPage } from "./OperatorsViewSkeleton";

export default function OperatorSlugClientPage() {
  const { slug } = useParams();
  const [operator, setOperator] = useState(null);

  useEffect(() => {
    if (!slug || typeof slug !== "string") return;
    const id = Number(slug.split("-")[0]);
    if (isNaN(id)) return;

    fetchOperatorById(id).then(setOperator);
  }, [slug]);

  if (!operator) return <OperatorsViewSkeletonPage/>;

  return (
    <OperatorsView operator={operator} slug={slug as string} />
  );
}
