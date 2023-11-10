import React from 'react';
import type { IInnvilgeVedtakOvergangsstønad, ISøknadsdatoer } from '../../../typer/dokumentApi';
import { Begrunnelse } from './innvilgeVedtak/Begrunnelse';
import { Inntektsperioder } from './innvilgeVedtak/Inntektsperioder';
import { Søknadsinformasjon } from './innvilgeVedtak/Søknadsinformasjon';
import { Vedtaksperioder } from './innvilgeVedtak/Vedtaksperioder';

export const InnvilgetOvergangsstønad: React.FC<{
  vedtak: IInnvilgeVedtakOvergangsstønad;
  søknadsdatoer?: ISøknadsdatoer;
}> = ({ vedtak, søknadsdatoer }) => {
  const { periodeBegrunnelse, perioder, inntektBegrunnelse, inntekter } = vedtak;
  return (
    <div className={'page-break'}>
      <h2>Vedtak</h2>
      <h3>Resultat</h3>
      <div>Innvilge</div>
      {søknadsdatoer && (
        <Søknadsinformasjon
          søknadsdato={søknadsdatoer.søknadsdato}
          søkerStønadFra={søknadsdatoer.søkerStønadFra}
        />
      )}
      <Vedtaksperioder perioder={perioder} />
      <div className={'page-break'}>
        <Begrunnelse begrunnelse={periodeBegrunnelse} />
        <Inntektsperioder inntekter={inntekter} />
      </div>
      <div className={'page-break'}>
        <Begrunnelse begrunnelse={inntektBegrunnelse} />
      </div>
    </div>
  );
};
