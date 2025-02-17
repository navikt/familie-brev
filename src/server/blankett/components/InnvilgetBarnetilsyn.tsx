import React from 'react';
import {
  IInnvilgeVedtakBarnetilsyn,
  IKontantstøttePerioder,
  ISøknadsdatoer,
} from '../../../typer/dokumentApiBlankett';
import { formaterIsoDato, mapBooleanTilJaNei, parseOgFormaterÅrMåned } from '../../utils/util';
import { Søknadsinformasjon } from './InnvilgeVedtak/Søknadsinformasjon';

export const InnvilgetBarnetilsyn: React.FC<{
  vedtak: IInnvilgeVedtakBarnetilsyn;
  søknadsdatoer?: ISøknadsdatoer;
  harKontantstøttePerioder: boolean;
  kontantstøttePerioderFraKs: IKontantstøttePerioder[];
  registeropplysningerOpprettetDato: string;
}> = ({
  vedtak,
  søknadsdatoer,
  harKontantstøttePerioder,
  kontantstøttePerioderFraKs,
  registeropplysningerOpprettetDato,
}) => {
  const { perioder, perioderKontantstøtte, tilleggsstønad, begrunnelse, kontantstøtteBegrunnelse } =
    vedtak;
  const kontantstøtteKilde = (kilde: string): string => {
    return kilde.toLowerCase().includes('ks_sak') ? 'KS sak' : kilde.toLowerCase();
  };

  const utledKontantstøtteperioderAlertTekst = (
    kontantstøttePerioderFraGrunnlagsdata: IKontantstøttePerioder[],
    registeropplysningerOpprettetDato: string,
    harKontantstøttePerioder?: boolean,
  ): React.ReactNode => {
    if (!harKontantstøttePerioder && kontantstøttePerioderFraGrunnlagsdata.length === 0) {
      return (
        <p>
          Bruker har verken fått eller får kontantstøtte (oppdatert{' '}
          {formaterIsoDato(registeropplysningerOpprettetDato)})
        </p>
      );
    }
    if (kontantstøttePerioderFraGrunnlagsdata.length > 0) {
      return (
        <p>
          Brukers kontantstøtteperioder (hentet {formaterIsoDato(registeropplysningerOpprettetDato)}
          )
        </p>
      );
    }
    return <p>Bruker har eller har fått kontantstøtte</p>;
  };
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
            {utledKontantstøtteperioderAlertTekst(
              kontantstøttePerioderFraKs,
              registeropplysningerOpprettetDato,
              harKontantstøttePerioder,
            )}
          </p>
          {harKontantstøttePerioder && (
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
                  <td>{kontantstøtteKilde(kontantstøtte.kilde)}</td>
                </tr>
              ))}
            </table>
          )}
          <h4>Vurdering:</h4>
          <p>
            Skal stønaden reduseres fordi brukeren, eller en brukeren bor med, har fått utbetalt
            kontantstøtte i perioden(e) det er søkt om?{' '}
            {mapBooleanTilJaNei(perioderKontantstøtte.length > 0, true)}
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
          {kontantstøtteBegrunnelse !== undefined && (
            <>
              <h4>Begrunnelse (hvis aktuelt):</h4>
              <p>{kontantstøtteBegrunnelse}</p>
            </>
          )}
        </>
      </div>

      <div className={'blankett-page-break'}>
        {tilleggsstønad && (
          <>
            <h3 className={'blankett'}>Tilleggstønad</h3>
            <h4>Vurdering:</h4>

            <p>
              Skal stønaden reduseres fordi brukeren har fått utbetalt stønad for tilsyn av barn
              etter tilleggsstønadsforskriften?{' '}
              {mapBooleanTilJaNei(tilleggsstønad.perioder.length > 0, true)}
            </p>
            {tilleggsstønad.perioder.length > 0 && (
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
            )}
            {tilleggsstønad.begrunnelse !== undefined && (
              <>
                <h4>Begrunnelse (hvis aktuelt):</h4>
                <p>{tilleggsstønad.begrunnelse}</p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
