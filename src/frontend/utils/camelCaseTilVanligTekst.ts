export const camelCaseTilVanligTekst = (camelCaseText: string) => {
  return camelCaseText
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase()
    .replace(/^./, str => str.toUpperCase());
};
