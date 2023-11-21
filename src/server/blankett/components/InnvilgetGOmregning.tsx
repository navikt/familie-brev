import React from 'react';
import type { IInnvilgeVedtakOvergangsstønad } from '../../../typer/dokumentApiBlankett';
import { Begrunnelse } from './InnvilgeVedtak/Begrunnelse';
import { Inntektsperioder } from './InnvilgeVedtak/Inntektsperioder';
import { Vedtaksperioder } from './InnvilgeVedtak/Vedtaksperioder';

export const InnvilgetGOmregning: React.FC<{
  vedtak: IInnvilgeVedtakOvergangsstønad;
}> = ({ vedtak }) => {
  const { periodeBegrunnelse, perioder, inntektBegrunnelse, inntekter } = vedtak;
  return (
    <div className={'blankett-page-break'}>
      <h2>Vedtak</h2>
      <h3 className={'blankett'}>Resultat</h3>
      <div>Innvilge</div>
      <Vedtaksperioder perioder={perioder} />
      <div className={'blankett-page-break'}>
        <Begrunnelse begrunnelse={periodeBegrunnelse} />
        <Inntektsperioder inntekter={inntekter} />
      </div>
      <div className={'blankett-page-break'}>
        <Begrunnelse begrunnelse={inntektBegrunnelse} />
      </div>
    </div>
  );
};
