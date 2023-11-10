import React from 'react';
import type { IInnvilgeVedtakBarnetilsyn, ISøknadsdatoer } from '../../../typer/dokumentApi';
import { parseOgFormaterÅrMåned } from '../../utils/util';
import { Søknadsinformasjon } from './InnvilgeVedtak/Søknadsinformasjon';

export const InnvilgetBarnetilsyn: React.FC<{
  vedtak: IInnvilgeVedtakBarnetilsyn;
  søknadsdatoer?: ISøknadsdatoer;
}> = ({ vedtak, søknadsdatoer }) => {
  const { perioder, perioderKontantstøtte, tilleggsstønad, begrunnelse } = vedtak;
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
      <h3>Vedtaksperiode</h3>
      {perioder.map((periode, indeks) => {
        return (
          <div key={indeks}>
            <h4>
              Fra og med {parseOgFormaterÅrMåned(periode.årMånedFra)} til og med{' '}
              {parseOgFormaterÅrMåned(periode.årMånedTil)}
            </h4>
            <div>Utgifter: {periode.utgifter}</div>
            <div>Antall barn: {periode.barn.length}</div>
          </div>
        );
      })}
      <div className={'page-break'}>
        <h4>Begrunnelse</h4>
        <p style={{ whiteSpace: 'pre-wrap' }}>{begrunnelse}</p>
        {perioderKontantstøtte.length > 0 && (
          <>
            <h3>Kontstøtte</h3>
            {perioderKontantstøtte.map((kontantstøtte, indeks) => {
              return (
                <div key={indeks}>
                  <h4>
                    Fra og med {parseOgFormaterÅrMåned(kontantstøtte.årMånedFra)} til og med{' '}
                    {parseOgFormaterÅrMåned(kontantstøtte.årMånedTil)}
                  </h4>
                  <div>Beløp: {kontantstøtte.beløp}</div>
                </div>
              );
            })}
          </>
        )}
      </div>
      <div className={'page-break'}>
        {tilleggsstønad && tilleggsstønad.harTilleggsstønad && (
          <>
            <h3>Tilleggstønad</h3>
            {tilleggsstønad.perioder.length === 0 && (
              <div>
                Stønaden skal ikke reduseres selv om bruker har søkt om eller fått utbetalt stønad
                for utgifter til tilsyn av barn etter tilleggsstønadsforskriften
              </div>
            )}
            {tilleggsstønad.perioder.map((tilleggstønadperiode, indeks) => {
              return (
                <div key={indeks}>
                  <h4>
                    Fra og med {parseOgFormaterÅrMåned(tilleggstønadperiode.årMånedFra)} til og med{' '}
                    {parseOgFormaterÅrMåned(tilleggstønadperiode.årMånedTil)}
                  </h4>
                  <div>Beløp: {tilleggstønadperiode.beløp}</div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};
