import React from 'react';
import {
  studietypeTilTekst,
  type IInnvilgeVedtakSkolepenger,
  type ISøknadsdatoer,
} from '../../../../typer/dokumentApi';
import { parseOgFormaterÅrMåned, tilSkoleår } from '../../../utils/util';
import { Begrunnelse } from '../../../components/InnvilgeVedtak/Begrunnelse';
import { Søknadsinformasjon } from '../../../components/InnvilgeVedtak/Søknadsinformasjon';

export const InnvilgetSkolepenger: React.FC<{
  vedtak: IInnvilgeVedtakSkolepenger;
  søknadsdatoer?: ISøknadsdatoer;
}> = ({ vedtak, søknadsdatoer }) => {
  return (
    <div className={'page-break'}>
      <h2>Vedtak</h2>
      <h3>Resultat</h3>
      <div>Innvilge</div>
      {søknadsdatoer && (
        <>
          <Søknadsinformasjon
            søknadsdato={søknadsdatoer.søknadsdato}
            søkerStønadFra={søknadsdatoer.søkerStønadFra}
          />
        </>
      )}

      {vedtak.skoleårsperioder.map((skoleårsperiode, i) => {
        const skoleår = tilSkoleår(skoleårsperiode.perioder[0]?.årMånedFra);
        return (
          <div key={i}>
            <h3>{`Utgifter til skoleåret ${skoleår}/${skoleår + 1}`}</h3>
            <h4>Utgifter</h4>
            <table>
              <thead>
                <tr>
                  <th>Utgiftsmåned</th>
                  <th>Stønadsbeløp</th>
                </tr>
              </thead>
              <tbody>
                {skoleårsperiode.utgiftsperioder.map((utgift, i) => (
                  <tr key={i}>
                    <td>{parseOgFormaterÅrMåned(utgift.årMånedFra)}</td>
                    <td>{utgift.stønad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h4>Studiebelastning</h4>
            <table>
              <thead>
                <tr>
                  <th>Fra</th>
                  <th>Til</th>
                  <th>Studietype</th>
                  <th>Belastning</th>
                </tr>
              </thead>
              <tbody>
                {skoleårsperiode.perioder.map((periode, i) => (
                  <tr key={i}>
                    <td>{parseOgFormaterÅrMåned(periode.årMånedFra)}</td>
                    <td>{parseOgFormaterÅrMåned(periode.årMånedTil)}</td>
                    <td>{studietypeTilTekst[periode.studietype]}</td>
                    <td>{periode.studiebelastning} %</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
      <div className={'page-break'}>
        <Begrunnelse begrunnelse={vedtak.begrunnelse} />
      </div>
    </div>
  );
};
