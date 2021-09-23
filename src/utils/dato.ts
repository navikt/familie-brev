export const datoFormat = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
} as const;

export const dagensDatoFormatert = (): string => {
  return new Date().toLocaleDateString('no-NO', datoFormat);
};
