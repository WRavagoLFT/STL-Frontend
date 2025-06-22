import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchGameCategories } from "~/utils/api/gamecategories";
import { AccessGuard } from "~/components/auth/AccessGuard";
import BettingComparisonPage from "./page";

const BettingComparisonSlug = () => {
  const { query } = useRouter();
  const { mainSlug, comparisonSlug } = query as {
    mainSlug?: string;
    comparisonSlug?: string;
  };

  const [category, setCategory] = useState<{
    GameCategoryId: number;
    Digits: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!comparisonSlug) return;

    const fetchCategory = async () => {
      setLoading(true);
      const result = await fetchGameCategories();
      if (result.success && Array.isArray(result.data)) {
      const normalizedSlug = comparisonSlug.replace(/-/g, "").toLowerCase();
      const matched = result.data.find((cat: any) => {
        const categorySlug = slugify(cat.GameCategory).replace(/-/g, "");
        //console.log("Comparing:", categorySlug, "vs", normalizedSlug);
        return categorySlug === normalizedSlug;
      });
        setCategory(matched || null);
      }
      setLoading(false);
    };

    fetchCategory();
  }, [comparisonSlug]);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");

  const isDashboard = comparisonSlug === "stl";
  const isValid = !!category || isDashboard;

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-600">Loading...</div>
    );
  }

  if (!isValid) {
    return (
      <div className="p-4 text-center text-red-500">
        <h1 className="text-xl font-semibold">Invalid Page</h1>
        <p>
          No matching game category for slug: <strong>{comparisonSlug}</strong>
        </p>
        <p>Only <code>/dashboard</code> is allowed if no game category is found.</p>
      </div>
    );
  }

  return (
    <AccessGuard allowedUserTypes={[3, 4, 6]}>
      <BettingComparisonPage
        gameCategoryId={category?.GameCategoryId}
        slug={comparisonSlug!}
        mainSlug={mainSlug}
      />
    </AccessGuard>
  );
};

export default BettingComparisonSlug;
