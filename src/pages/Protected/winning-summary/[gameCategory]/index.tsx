import { useRouter } from 'next/router';
import React from 'react';
import WinningSummaryPage from '..';

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

  return <WinningSummaryPage gameCategoryId={gameCategoryMapping[gameCategory as string]} />;
};

export default DynamicWinningSummary;
