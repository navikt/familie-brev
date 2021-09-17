import { Maalform } from '../../../typer/sanitygrensesnitt';
import { IBegrunnelsedata } from '../../typer';

interface IMockBegrunnelsedata {
  apiNavn?: string;
  gjelderSoker?: boolean;
  barnasFodselsdatoer?: string;
  antallBarn?: number;
  maanedOgAarBegrunnelsenGjelderFor?: string;
  maalform?: Maalform;
}

export const mockBegrunnelsedata = ({
  apiNavn = '',
  gjelderSoker = true,
  barnasFodselsdatoer = '1. mai',
  antallBarn = 1,
  maanedOgAarBegrunnelsenGjelderFor = '2. mai',
  maalform = Maalform.NB,
}: IMockBegrunnelsedata = {}): IBegrunnelsedata => ({
  apiNavn,
  gjelderSoker,
  barnasFodselsdatoer,
  antallBarn,
  maanedOgAarBegrunnelsenGjelderFor,
  maalform,
});
