import React from 'react';
import { formaterIsoDato } from '../../utils/util';
import type {
  ITidligereVedtaksperioder,
  IGrunnlagsdataPeriodeHistorikkOvergangsstønad,
} from '../../../typer/dokumentApiBlankett';
import { aktivitetsTypeTilTekst, periodetypeTilTekst } from '../../../typer/dokumentApiBlankett';

export const InntektGrunnlag: React.FC<{
  tidligereVedtaksperioder: ITidligereVedtaksperioder | undefined;
}> = ({ tidligereVedtaksperioder }) => {
  const sistePeriodeMedOvergangsstønad =
    tidligereVedtaksperioder?.sak?.periodeHistorikkOvergangsstønad?.[0];

  if (!sistePeriodeMedOvergangsstønad) {
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
          {[sistePeriodeMedOvergangsstønad].map(
            (periode: IGrunnlagsdataPeriodeHistorikkOvergangsstønad, index) => (
              <tr key={index}>
                <td>
                  {formaterIsoDato(periode.fom)} - {formaterIsoDato(periode.tom)}
                </td>
                <td>{periodetypeTilTekst[periode.vedtaksperiodeType]}</td>
                <td>{periode.aktivitet ? aktivitetsTypeTilTekst[periode.aktivitet] : ''}</td>
                <td>{periode.inntekt ?? 0}</td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </>
  );
};
