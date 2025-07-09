import { AccessGuard } from "~/components/auth/AccessGuard";
import ClientBettingSummary from "~/components/betting-summary/ClientBettingSummary";

interface Props {
  params: { mainSlug: string };
}

export default function BettingSummarySlugPage({ params }: Props) {
  return (
    <AccessGuard allowedUserTypes={[3, 4, 6]}>
      <ClientBettingSummary slug={params.mainSlug} />
    </AccessGuard>
  );
}
