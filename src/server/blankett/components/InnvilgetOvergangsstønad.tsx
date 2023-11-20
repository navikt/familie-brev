import React from 'react';
import type {
  IInnvilgeVedtakOvergangsstønad,
  ISøknadsdatoer,
} from '../../../typer/dokumentApiBlankett';
import { Begrunnelse } from './InnvilgeVedtak/Begrunnelse';
import { Inntektsperioder } from './InnvilgeVedtak/Inntektsperioder';
import { Søknadsinformasjon } from './InnvilgeVedtak/Søknadsinformasjon';
import { Vedtaksperioder } from './InnvilgeVedtak/Vedtaksperioder';

export const InnvilgetOvergangsstønad: React.FC<{
  vedtak: IInnvilgeVedtakOvergangsstønad;
  søknadsdatoer?: ISøknadsdatoer;
}> = ({ vedtak, søknadsdatoer }) => {
  const { periodeBegrunnelse, perioder, inntektBegrunnelse, inntekter } = vedtak;
  return (
    <div className={'blankett-page-break'}>
      <h2>Vedtak</h2>
      <h3 className={'blankett'}>Resultat</h3>
      <div>Innvilge</div>
      {søknadsdatoer && (
        <Søknadsinformasjon
          søknadsdato={søknadsdatoer.søknadsdato}
          søkerStønadFra={søknadsdatoer.søkerStønadFra}
        />
      )}
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
