"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchGameCategories } from "~/lib/api/gamecategories";
import { AccessGuard } from "~/components/auth/AccessGuard";
import { ParentWinningSummaryPage } from "~/components/winning-summary/ParentWinningSummary";

// Normalize slug: "STL Swer 2" -> "stlswer2"
const normalizeSlug = (text: string) =>
  text
    .replace(/Swer\s*2/gi, "Swer2")
    .replace(/Swer\s*3/gi, "Swer3")
    .replace(/Swer\s*4/gi, "Swer4")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/-/g, "")
    .replace(/[^\w]/g, "");

interface PageProps {
  params: {
    mainSlug: string;
  };
}

export default function WinningSummarySlugPage() {
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
    return <div className="p-4 text-center text-gray-600">Loading...</div>;
  }

  if (invalid) return null;

  return (
    <AccessGuard allowedUserTypes={[3, 4, 6]}>
      <ParentWinningSummaryPage
        gameCategoryId={category?.GameCategoryId || 0}
        slug={mainSlug ?? ""}
      />
    </AccessGuard>
  );
}
