import { useRouter } from 'next/router';
import BettingSummaryPage from '../index';

const DynamicBettingSummary = () => {
  const router = useRouter();
  const { gameCategory } = router.query;

  const gameCategoryMapping: Record<string, number> = {
    'dashboard': 0,
    'stl-pares': 1,
    'stl-swer2': 2,
    'stl-swer3': 3,
    'stl-swer4': 4,
  }

  return <BettingSummaryPage gameCategoryId={gameCategoryMapping[gameCategory as string]}/>;
};

export default DynamicBettingSummary;
