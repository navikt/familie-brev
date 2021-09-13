import { hentDelmalQuery } from '../server/sanity/Queries';

export const hentBegrunnelserQuery = () => `
 *[_type == "begrunnelse"]{
     apiNavn,
     navnISystem,
     hjemler,
     vilkaar,  
     rolle,   
     lovligOppholdTriggere,
     bosattIRiketTriggere,
     giftPartnerskapTriggere,
     ovrigeTriggere
 }
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
 *[_type == "begrunnelse" && apiNavn=="${apiNavn}"][0].${maalform}[]{...,children[]
   {..., 
     _type == "valgReferanse"=>{...}->{..., valg[]{..., delmal->${hentDelmalQuery(maalform)}}}
   }
 }

`;
