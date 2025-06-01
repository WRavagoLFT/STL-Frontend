import { useRouter } from 'next/router';
import React from 'react';
import WinningSummaryPage from '..';
import { AccessGuard } from '~/components/auth/AccessGuard';

const DynamicWinningSummary = () => {
  const router = useRouter();
  // Extract Dynamic param
  const { gameCategory } = router.query;

  const gameCategoryMapping: Record<string, number> = {
    'dashhboard': 0,
    'stl-pares': 1,
    'stl-swer2': 2,
    'stl-swer3': 3,
    'stl-swer4': 4,
  }

  return (
    <AccessGuard allowedUserTypes={[3, 4, 6]}>
      <WinningSummaryPage gameCategoryId={gameCategoryMapping[gameCategory as string]} />
    </AccessGuard>
  );
};

export default DynamicWinningSummary;
