import { Maalform } from '../typer/sanitygrensesnitt';

export interface IBegrunnelseData {
  gjelderSøker: boolean; //todo =false
  barnasFødselsdatoer: string[]; // todo =[]
  antallBarn: number; // todo =0
  månedOgÅrBegrunnelsenGjelderFor: string; //todo = ""
  målform: Maalform;
}

export enum Formuleringstype {
  FOR_BARN_FØDT = 'forBarnFødt',
  DU_OG_ELLER_BARNET_BARNA = 'duOgEllerBarnetBarna',
}
