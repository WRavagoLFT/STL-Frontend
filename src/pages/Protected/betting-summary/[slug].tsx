import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchGameCategories } from "~/utils/api/gamecategories";
import { AccessGuard } from "~/components/auth/AccessGuard";
import BettingSummaryPage from ".";

const BettingCategoryPage = () => {
  const { query } = useRouter();
  const slug = query.slug as string;

  const [category, setCategory] = useState<null | {
    GameCategoryId: number;
    GameCategory: string;
    Digits: number;
  }>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchCategory = async () => {
      setLoading(true);
      const result = await fetchGameCategories();

      if (result.success && Array.isArray(result.data)) {
        const matched = result.data.find(
          (cat: any) => slugify(cat.GameCategory) === slug.toLowerCase()
        );

        setCategory(matched || null);
      }

      setLoading(false);
    };

    fetchCategory();
  }, [slug]);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");

  const isDashboard = slug === "dashboard";
  const isValid = category || isDashboard;

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-600">
        {/* Loading... */}
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="p-4 text-center text-red-500">
        <h1 className="text-xl font-semibold">Invalid Page</h1>
        <p>No matching game category for slug: <strong>{slug}</strong></p>
        <p>Only <code>/dashboard</code> is allowed if no game category is found.</p>
      </div>
    );
  }

  return (
    <AccessGuard allowedUserTypes={[6]}>
      {/* <div className="p-4">
        <h1 className="text-xl font-semibold">Game Category</h1>
        {category ? (
          <>
            <p>ID: {category.GameCategoryId}</p>
            <p>Name: {category.GameCategory}</p>
            <p>Digits: {category.Digits}</p>
          </>
        ) : (
          <p className="text-yellow-500">
            No specific category found for slug: <strong>{slug}</strong>. Showing dashboard data.
          </p>
        )}
      </div> */}

      <BettingSummaryPage
        gameCategoryId={category?.GameCategoryId}
        slug={slug}
      />
    </AccessGuard>
  );
};

export default BettingCategoryPage;
