"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ParentBettingSummary } from "./ParentBettingSummary";
import BettingSummarySkeleton from "./BettingSummarySkeleton";
import { fetchGameCategories } from "@/lib/api/gamecategories";

const normalizeSlug = (text: string) =>
  text
    .replace(/Swer\s*2/gi, "Swer2")
    .replace(/Swer\s*3/gi, "Swer3")
    .replace(/Swer\s*4/gi, "Swer4")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/-/g, "")
    .replace(/[^\w]/g, "");

export default function ClientBettingSummary({ slug }: { slug: string }) {
  const router = useRouter();

  const [category, setCategory] = useState<{
    GameCategoryId: number;
    GameCategory: string;
    Digits: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);

  const fetchCategory = useCallback(async () => {
    if (!slug) return;

    setLoading(true);
    const result = await fetchGameCategories();

    if (result.success && Array.isArray(result.data)) {
      const normalizedSlug = normalizeSlug(slug);

      const matched = result.data.find((cat: any) => {
        const categorySlug = normalizeSlug(cat.GameCategory);
        return categorySlug === normalizedSlug;
      });

      if (matched) {
        setCategory(matched);
      } else if (slug !== "dashboard") {
        setInvalid(true);
      }
    }

    setLoading(false);
  }, [slug]);

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
    <ParentBettingSummary
      gameCategoryId={category?.GameCategoryId || 0}
      slug={slug}
    />
  );
}
