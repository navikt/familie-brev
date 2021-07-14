import { Maalform } from '../typer/sanitygrensesnitt';

export interface IBegrunnelseData {
  gjelderSøker: boolean;
  barnasFødselsdatoer: string;
  antallBarn: number;
  månedOgÅrBegrunnelsenGjelderFor: string;
  målform: Maalform;
}

export enum Formuleringstype {
  FOR_BARN_FØDT = 'forBarnFødt',
  DU_OG_ELLER_BARNET_BARNA = 'duOgEllerBarnetBarna',
}
