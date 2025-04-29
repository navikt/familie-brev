import React from 'react';
import {
  samværsandelTilVerdi,
  Samværsavtale as Avtale,
  Samværsdag,
  Samværsuke,
} from '../../../typer/dokumentApiBlankett';

interface Props {
  samværsavtale: Avtale;
}

const utledOppsummering = (samværsuker: Samværsuke[]) => {
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

export const Samværsavtale: React.FC<Props> = ({ samværsavtale }) => (
  <div>
    <Oppsummering samværsavtale={samværsavtale} />;
  </div>
);

const Oppsummering: React.FC<Props> = ({ samværsavtale }) => (
  <div className={'blankett-samværsavtale'}>{utledOppsummering(samværsavtale.uker)}</div>
);
