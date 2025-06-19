import { useRouter } from "next/router";
import BettingComparisonPage from ".";

export default function GameSlugPage() {
  const { slug } = useRouter().query;

  if (!slug || typeof slug !== "string") return null;

  return <BettingComparisonPage slug={slug} />;
}