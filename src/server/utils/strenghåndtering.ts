export const lagStorForbokstav = (tekst: string) => tekst.replace(/^./, tekst[0].toUpperCase());

export const startMedStorBokstav = (tekst: string) => {
  return tekst.charAt(0).toUpperCase() + tekst.slice(1).toLowerCase();
};
