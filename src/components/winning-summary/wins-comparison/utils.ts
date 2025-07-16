export const formatDate = (date: string | null): string => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getGameCategoryParam = (gameCategoryId?: number) => {
  if (gameCategoryId && gameCategoryId >= 1 && gameCategoryId <= 4) {
    return { gameCategory: gameCategoryId };
  }
  return {};
};

// export const datesMatch = (dateString1: string, dateString2: string): boolean => {
//   return formatDate(dateString1) === formatDate(dateString2);
// };

export const datesMatch = (dateString1: string, dateString2: string): boolean => {
  return formatDate(dateString1) === formatDate(dateString2);
};