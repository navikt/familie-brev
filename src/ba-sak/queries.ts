export const hentBegrunnelserQuery = () => `
 *[_type == "begrunnelse"]{apiNavn, navnISystem}
`;

export const hentBegrunnelserAvTypeQuery = (type: string) => `
 *[_type == "begrunnelse" && begrunnelsetype=="${type}"]{apiNavn, navnISystem}
`;

export const hentBegrunnelserForVilkårQuery = (vilkår: string) => `
 *[_type == "begrunnelse" && vilkaar=="${vilkår}"]{apiNavn, navnISystem}
`;

export const hentHjemlerForBegrunnelseQuery = (begrunnelseApiNavn: string) => `
 *[_type == "begrunnelse" && apiNavn == "${begrunnelseApiNavn}"][0].hjemler
`;

export const hentBegrunnelseQuery = (apiNavn: string) => `
 *[_type == "begrunnelse" && apiNavn=="${apiNavn}"][0]
  {apiNavn, begrunnelsetype, navnISystem, vilkaar, visningsnavn}
`;

export const hentBegrunnelseTekstQuery = (apiNavn: string, maalform: string) => `
 *[_type == "begrunnelse" && apiNavn=="${apiNavn}"][0].${maalform}
`;