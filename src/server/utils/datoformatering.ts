export function formaterYearMonthTilNorskFormat(yearMonth: string): string {
  const [år, måned] = yearMonth.split('-');

  return `${måned}.${år}`;
}
