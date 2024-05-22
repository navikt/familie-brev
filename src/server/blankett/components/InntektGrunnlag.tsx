import React from 'react';
import { formaterIsoDato } from '../../utils/util';
import type {
  ITidligereVedtaksperioder,
  IGrunnlagsdataPeriodeHistorikkOvergangsstønad,
} from '../../../typer/dokumentApiBlankett';
import { periodetypeTilTekst } from '../../../typer/dokumentApiBlankett';

export const InntektGrunnlag: React.FC<{
  tidligereVedtaksperioder: ITidligereVedtaksperioder | undefined;
}> = ({ tidligereVedtaksperioder }) => {
  if (
    !tidligereVedtaksperioder?.sak?.periodeHistorikkOvergangsstønad ||
    tidligereVedtaksperioder.sak.periodeHistorikkOvergangsstønad.length === 0
  ) {
    return null;
  }

  return (
    <>
      <h3>Registerdata</h3>
      <p>Siste periode med overgangsstønad</p>
      <table>
        <thead>
          <tr>
            <th>Periode</th>
            <th>Type</th>
            <th>Aktivitet</th>
            <th>Inntekt</th>
          </tr>
        </thead>
        <tbody>
          {tidligereVedtaksperioder?.sak?.periodeHistorikkOvergangsstønad.map(
            (periode: IGrunnlagsdataPeriodeHistorikkOvergangsstønad, index) => (
              <tr key={index}>
                <td>
                  {formaterIsoDato(periode.fom)} - {formaterIsoDato(periode.tom)}
                </td>
                <td>{periodetypeTilTekst[periode.vedtaksperiodeType]}</td>
                <td>{periode.aktivitet}</td>
                <td>{periode.inntekt}</td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </>
  );
};
