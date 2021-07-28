import { Maalform } from '../typer/sanitygrensesnitt';
import { Flettefelt } from '../typer/dokumentApi';

export interface IBegrunnelsedata {
  apiNavn: string;
  gjelderSoker: boolean;
  barnasFodselsdatoer: string;
  antallBarn: number;
  maanedOgÅrBegrunnelsenGjelderFor: string;
  maalform: Maalform;
}

export interface IPeriodedata {
  [key: string]: IBegrunnelsedata[] | Flettefelt;
}

export enum Formuleringstype {
  FOR_BARN_FØDT = 'forBarnFødt',
  DU_OG_ELLER_BARNET_BARNA = 'duOgEllerBarnetBarna',
}
