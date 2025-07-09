import { AccessGuard } from "~/components/auth/AccessGuard";
import ClientBettingComparison from "~/components/betting-summary/bets-comparison/ClientBettingComparison";

interface Props {
  params: { mainSlug: string };
}

export default function BettingComparisonSlugPage({ params }: Props) {
  return (
    <AccessGuard allowedUserTypes={[3, 4, 6]}>
      <ClientBettingComparison slug={params.mainSlug} />
    </AccessGuard>
  );
}
