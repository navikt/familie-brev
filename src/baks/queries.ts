import { hentDelmalQuery } from '../server/sanity/Queries';
import { Datasett } from '../server/sanity/sanityClient';

export const hentKsBegrunnelserQuery = () => `
 *[_type == "ksBegrunnelse"]
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

export const hentBegrunnelseTekstQuery = (
  apiNavn: string,
  maalform: string,
  datasett: Datasett,
) => `
 *[_type == "${
   erKsDatasett(datasett) ? 'ksBegrunnelse' : 'begrunnelse'
 }" && apiNavn=="${apiNavn}"][0].${maalform}[]{...,children[]
   {..., 
     _type == "valgReferanse"=>{...}->{..., valg[]{..., delmal->${hentDelmalQuery(maalform)}}},
     _type == "valgfeltV2"=>{..., valgReferanse->{..., valg[]{..., delmal->${hentDelmalQuery(
       maalform,
     )}}}}
   }
 }

`;

const erKsDatasett = (datasett: Datasett) =>
  datasett == Datasett.KS || datasett == Datasett.KS_TEST || datasett == Datasett.KS_V2;
