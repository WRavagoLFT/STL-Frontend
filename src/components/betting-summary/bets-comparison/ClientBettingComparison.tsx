"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchGameCategories } from "@/lib/api/gamecategories";
import BettingSummarySkeleton from "../BettingSummarySkeleton";
import ParentComparisonBetting from "../ParentBettingComparison";


type GameCategory = {
  GameCategoryId: number;
  GameCategory: string;
  Digits: number;
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");

const normalize = (text: string) => slugify(text).replace(/-/g, "");

interface ClientBettingComparisonProps {
  mainSlug: string;
  comparisonSlug: string;
}

export default function ClientBettingComparison({
  mainSlug,
  comparisonSlug,
}: ClientBettingComparisonProps) {
  const router = useRouter();
  const [category, setCategory] = useState<GameCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const result = await fetchGameCategories();

        if (result.success && Array.isArray(result.data)) {
          const normalizedSlug = normalize(comparisonSlug);

          const matched = result.data.find((cat: GameCategory) => {
            const catSlug = normalize(cat.GameCategory);
            return catSlug === normalizedSlug;
          });

          if (matched) {
            setCategory(matched);
          } else {
            setInvalid(true);
          }
        } else {
          setInvalid(true);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setInvalid(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [comparisonSlug]);

  useEffect(() => {
    if (!loading && invalid) {
      router.replace("/not-found");
    }
  }, [loading, invalid, router]);

  if (loading) return <BettingSummarySkeleton />;
  if (invalid || !category) return null;

  return (
    <ParentComparisonBetting
      gameCategoryId={category.GameCategoryId}
      slug={comparisonSlug}
      mainSlug={mainSlug}
    />
  );
}
