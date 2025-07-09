"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchGameCategories } from "~/lib/api/gamecategories";
import { AccessGuard } from "~/components/auth/AccessGuard";
import { ParentBettingSummary } from "~/components/betting-summary/ParentBettingSummary";
import BettingSummarySkeleton from "~/components/betting-summary/BettingSummarySkeleton";

const normalizeSlug = (text: string) =>
  text
    .replace(/Swer\s*2/gi, "Swer2")
    .replace(/Swer\s*3/gi, "Swer3")
    .replace(/Swer\s*4/gi, "Swer4")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/-/g, "")
    .replace(/[^\w]/g, "");

export default function BettingSummarySlugPage() {
  const router = useRouter();
  const params = useParams();
  const mainSlug = params?.mainSlug as string;

  const [category, setCategory] = useState<{
    GameCategoryId: number;
    GameCategory: string;
    Digits: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);

  const fetchCategory = useCallback(async () => {
    if (!mainSlug) return;

    setLoading(true);
    const result = await fetchGameCategories();

    if (result.success && Array.isArray(result.data)) {
      const normalizedSlug = normalizeSlug(mainSlug);

      const matched = result.data.find((cat: any) => {
        const categorySlug = normalizeSlug(cat.GameCategory);
        return categorySlug === normalizedSlug;
      });

      if (matched) {
        setCategory(matched);
      } else if (mainSlug !== "dashboard") {
        setInvalid(true);
      }
    }

    setLoading(false);
  }, [mainSlug]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  useEffect(() => {
    if (!loading && invalid) {
      router.replace("/not-found");
    }
  }, [loading, invalid, router]);

  if (loading) {
    return <BettingSummarySkeleton />;
  }

  if (invalid) return null;

  return (
    <AccessGuard allowedUserTypes={[3, 4, 6]}>
      <ParentBettingSummary
        gameCategoryId={category?.GameCategoryId || 0}
        slug={mainSlug ?? ""}
      />
    </AccessGuard>
  );
}