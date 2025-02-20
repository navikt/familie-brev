import React from 'react';
import {
  samværsandelTilVerdi,
  Samværsavtale,
  Samværsdag,
  Samværsuke,
} from '../../../typer/dokumentApiBlankett';

interface Props {
  avtale: Samværsavtale;
}

export const SamværsavtaleVisning: React.FC<Props> = ({ avtale }) => (
  <div className={'blankett-samværsavtale'}>{utledVisningstekstForSamværsavtale(avtale.uker)}</div>
);

const utledVisningstekstForSamværsavtale = (samværsuker: Samværsuke[]) => {
  const summertSamvær = samværsuker
    .flatMap(samværsuke =>
      Object.values(samværsuke).flatMap((samværsdag: Samværsdag) => samværsdag.andeler),
    )
    .map(andel => samværsandelTilVerdi[andel])
    .reduce((acc, andel) => acc + andel, 0);

  const maksimalSamværsandel = samværsuker.length * 7 * 8;

  const antallHeleDagerMedSamvær = Math.floor(summertSamvær / 8);

  const rest = summertSamvær % 8;
  const restSuffix = rest === 0 ? '' : '/8';

  const prosentandel = summertSamvær / maksimalSamværsandel;

  const visningstekstAntallDager = `${antallHeleDagerMedSamvær} dager og ${rest}${restSuffix} deler`;
  const visningstekstProsentandel = `${Math.round(prosentandel * 1000) / 10}%`;
  return `Samvær: ${visningstekstAntallDager} av totalt ${samværsuker.length} uker = ${visningstekstProsentandel}`;
};
