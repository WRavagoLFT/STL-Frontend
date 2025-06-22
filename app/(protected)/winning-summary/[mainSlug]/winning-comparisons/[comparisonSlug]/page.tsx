"use client";

import { useEffect, useState } from "react";
import { fetchGameCategories } from "~/utils/api/gamecategories";
import { AccessGuard } from "~/components/auth/AccessGuard";
import { WinningComparisonPage } from "~/components/winning-summary/WinningComparison";
import { useParams } from "next/navigation";

interface PageProps {
  params: {
    mainSlug: string;
    comparisonSlug: string;
  };
}

const slugify = (text: string) => {
  return text
    .replace(/Swer2/i, "Swer 2")
    .replace(/Swer3/i, "Swer 3")
    .replace(/Swer4/i, "Swer 4")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

export default function WinningComparisonSlugPage({ params }: PageProps) {
  const { mainSlug, comparisonSlug } = useParams() as {
    mainSlug: string;
    comparisonSlug: string;
  };  

  const [category, setCategory] = useState<{
    GameCategoryId: number;
    Digits: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!comparisonSlug) return;

      setLoading(true);
      const result = await fetchGameCategories();

      if (result.success && Array.isArray(result.data)) {
        const normalizedSlug = comparisonSlug.replace(/-/g, "").toLowerCase();

        const matched = result.data.find((cat: any) => {
          const categorySlug = slugify(cat.GameCategory).replace(/-/g, "");
          return categorySlug === normalizedSlug;
        });

        setCategory(matched || null);
      }

      setLoading(false);
    };

    fetchCategory();
  }, [comparisonSlug]);

  const isDashboard = comparisonSlug === "stl";
  const isValid = !!category || isDashboard;

  if (loading) {
    return <div className="p-4 text-center text-gray-600">Loading...</div>;
  }

  if (!isValid) {
    return (
      <div className="p-4 text-center text-red-500">
        <h1 className="text-xl font-semibold">Invalid Page</h1>
        <p>
          No matching game category for slug: <strong>{comparisonSlug}</strong>
        </p>
        <p>
          Only <code>/dashboard</code> is allowed if no game category is found.
        </p>
      </div>
    );
  }

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
