"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchGameCategories } from "~/lib/api/gamecategories";
import { AccessGuard } from "~/components/auth/AccessGuard";
import WinningComparisonPage from "~/components/winning-summary/ParentWinningComparison";

const slugify = (text: string) =>
  text
    .replace(/Swer2/i, "Swer 2")
    .replace(/Swer3/i, "Swer 3")
    .replace(/Swer4/i, "Swer 4")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");

const normalize = (text: string) => slugify(text).replace(/-/g, "");

export default function WinningComparisonSlugPageClient() {
  const router = useRouter();
  const { mainSlug, comparisonSlug } = useParams() as {
    mainSlug: string;
    comparisonSlug: string;
  };

  const [category, setCategory] = useState<{
    GameCategoryId: number;
    Digits: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      const result = await fetchGameCategories();
      // console.log("[Client] Game Categories:", result);

      if (result.success && Array.isArray(result.data)) {
        const normalizedSlug = normalize(comparisonSlug);

        const matched = result.data.find((cat: any) => {
          const catSlug = normalize(cat.GameCategory);
          return catSlug === normalizedSlug;
        });

        if (matched) {
          setCategory(matched);
        } else if (comparisonSlug !== "stl") {
          setInvalid(true);
        }
      } else {
        console.warn("Failed to fetch categories on client.");
        setInvalid(true);
      }

      setLoading(false);
    };

    fetchCategory();
  }, [comparisonSlug]);

  useEffect(() => {
    if (!loading && invalid) {
      router.replace("/not-found");
    }
  }, [loading, invalid]);

  if (loading)
    return <div className="p-4 text-center text-gray-600">Loading...</div>;
  if (invalid) return null;

  return (
    <AccessGuard allowedUserTypes={[6]}>
      <WinningComparisonPage
        gameCategoryId={category?.GameCategoryId}
        slug={comparisonSlug}
        mainSlug={mainSlug}
      />
    </AccessGuard>
  );
}
