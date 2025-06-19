import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchGameCategories } from "~/utils/api/gamecategories";
import { AccessGuard } from "~/components/auth/AccessGuard";
import BettingSummaryPage from "..";

const BettingSummarySlugPage = () => {
  const router = useRouter();
  const { mainSlug } = router.query as { mainSlug?: string };
  const [category, setCategory] = useState<{GameCategoryId: number; GameCategory: string; Digits: number;} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mainSlug) return;

    const fetchCategory = async () => {
      setLoading(true);
      const result = await fetchGameCategories();

      if (result.success && Array.isArray(result.data)) {
        const matched = result.data.find(
          (cat: any) => slugify(cat.GameCategory) === mainSlug.toLowerCase()
        );
        setCategory(matched || null);
      }

      setLoading(false);
    };

    fetchCategory();
  }, [mainSlug]);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");

  const isDashboard = mainSlug === "dashboard";
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
          No matching game category for slug: <strong>{mainSlug}</strong>
        </p>
        <p>Only <code>/dashboard</code> is allowed if no game category is found.</p>
      </div>
    );
  }

  return (
    <AccessGuard allowedUserTypes={[6]}>
      <BettingSummaryPage
        gameCategoryId={category?.GameCategoryId}
        slug={mainSlug!} // non-null since isValid passed
      />
    </AccessGuard>
  );
};

export default BettingSummarySlugPage;
