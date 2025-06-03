import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchOperatorById } from "~/services/userService";
import OperatorsView from "./operators-view";
import { Operator } from "~/types/types";
import { AccessGuard } from "~/components/auth/AccessGuard";

const OperatorSlugPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [operator, setOperator] = useState<Operator | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug || typeof slug !== "string") return;

    // Extract operator ID from slug
    const [idStr] = slug.split("-");
    const operatorId = Number(idStr);

    if (isNaN(operatorId)) {
      console.error("Invalid operator ID in slug:", slug);
      setOperator(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchOperatorById(operatorId)
      .then((data) => {
        setOperator(data);
      })
      .catch((err) => {
        console.error("Error fetching operator by ID:", err);
        setOperator(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!operator) {
    return <p className="text-center text-red-500">No operator found.</p>;
  }

  return (
    <AccessGuard allowedUserTypes={[6]}>
      <OperatorsView operator={operator} slug={slug as string} />
    </AccessGuard>
  );
};

export default OperatorSlugPage;
