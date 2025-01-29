import React from 'react';
import {
  IInnvilgeVedtakBarnetilsyn,
  IKontantstøttePerioder,
  ISøknadsdatoer,
} from '../../../typer/dokumentApiBlankett';
import {
  formaterNullableIsoDato,
  mapBooleanTilJaNei,
  parseOgFormaterÅrMåned,
} from '../../utils/util';
import { Søknadsinformasjon } from './InnvilgeVedtak/Søknadsinformasjon';

export const InnvilgetBarnetilsyn: React.FC<{
  vedtak: IInnvilgeVedtakBarnetilsyn;
  søknadsdatoer?: ISøknadsdatoer;
  kontantstøttePerioderFraKs: IKontantstøttePerioder[];
}> = ({ vedtak, søknadsdatoer, kontantstøttePerioderFraKs }) => {
  const { perioder, perioderKontantstøtte, tilleggsstønad, begrunnelse } = vedtak;
  const harKontantstøttePerioder = kontantstøttePerioderFraKs.length > 0;
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
      <h3 className={'blankett'}>Vedtaksperiode</h3>
      {perioder.map((periode, indeks) => {
        return (
          <div key={indeks}>
            <h4 className={'blankett'}>
              Fra og med {parseOgFormaterÅrMåned(periode.årMånedFra)} til og med{' '}
              {parseOgFormaterÅrMåned(periode.årMånedTil)}
            </h4>
            <div>Utgifter: {periode.utgifter}</div>
            <div>Antall barn: {periode.barn.length}</div>
          </div>
        );
      })}
      <div className={'blankett-page-break'}>
        <h4 className={'blankett'}>Begrunnelse</h4>
        <p style={{ whiteSpace: 'pre-wrap' }}>{begrunnelse}</p>
        <>
          <h3 className={'blankett'}>Kontantstøtte</h3>
          <h4>Info fra KS Sak:</h4>
          <p>
            {harKontantstøttePerioder
              ? 'Brukers kontantstøtteperioder (hentet ' +
                formaterNullableIsoDato(kontantstøttePerioderFraKs[0].hentetDato) +
                ')'
              : 'Bruker har verken fått eller får kontantstøtte'}
          </p>
          <table className="tabellUtenBorder">
            <tr>
              <th>Perioder fra og med</th>
              <th>Perioder til og med</th>
              <th>Kilde</th>
              <th></th>
            </tr>
            {kontantstøttePerioderFraKs.map((kontantstøtte, indeks) => (
              <tr key={indeks}>
                <td>{parseOgFormaterÅrMåned(kontantstøtte.fomMåned)}</td>
                <td>
                  {kontantstøtte.tomMåned ? parseOgFormaterÅrMåned(kontantstøtte.tomMåned) : ''}
                </td>
                <td>{kontantstøtte.kilde}</td>
              </tr>
            ))}
          </table>
          <h4>Vurdering:</h4>
          <p>
            Er det søkt om, utbetales det eller har det blitt utbetalt kontantstøtte til brukeren
            eller en brukeren bor med i perioden(e) det er søkt om?{' '}
            {mapBooleanTilJaNei(harKontantstøttePerioder, true)}
          </p>
          {perioderKontantstøtte.length > 0 && (
            <table className="tabellUtenBorder">
              <tr>
                <th>Perioder fra og med</th>
                <th>Perioder til og med</th>
                <th>Kontantstøtte</th>
              </tr>
              {perioderKontantstøtte.map((kontantstøtte, indeks) => (
                <tr key={indeks}>
                  <td>{parseOgFormaterÅrMåned(kontantstøtte.årMånedFra)}</td>
                  <td>{parseOgFormaterÅrMåned(kontantstøtte.årMånedTil)}</td>
                  <td>{kontantstøtte.beløp}</td>
                </tr>
              ))}
            </table>
          )}
        </>
      </div>

      <div className={'blankett-page-break'}>
        {tilleggsstønad && tilleggsstønad.harTilleggsstønad && (
          <>
            <h3 className={'blankett'}>Tilleggstønad</h3>
            <h4>Vurdering:</h4>
            <p>
              Er det søkt om, utbetales det eller har det blitt utbetalt stønad for utgifter til
              tilsyn av barn etter tilleggsstønadsforskriften i perioden(e) det er søkt om?{' '}
              {mapBooleanTilJaNei(tilleggsstønad.harTilleggsstønad, true)}
            </p>

            <p>
              Skal stønaden reduseres fordi brukeren har fått utbetalt stønad for tilsyn av barn
              etter tilleggsstønadsforskriften?{' '}
              {mapBooleanTilJaNei(tilleggsstønad.perioder.length > 0, true)}
            </p>

            <table className="tabellUtenBorder">
              <tr>
                <th>Perioder fra og med</th>
                <th>Perioder til og med</th>
                <th>Stønadsreduksjon</th>
              </tr>
              {tilleggsstønad.perioder.map((tilleggstønadperiode, indeks) => (
                <tr key={indeks}>
                  <td>{parseOgFormaterÅrMåned(tilleggstønadperiode.årMånedFra)}</td>
                  <td>{parseOgFormaterÅrMåned(tilleggstønadperiode.årMånedTil)}</td>
                  <td>{tilleggstønadperiode.beløp}</td>
                </tr>
              ))}
            </table>
            <h4>Begrunnelse:</h4>
            <p>{tilleggsstønad.begrunnelse}</p>
          </>
        )}
      </div>
    </div>
  );
};
