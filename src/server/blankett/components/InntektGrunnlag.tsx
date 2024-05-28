import React from 'react';
import { formaterIsoDato } from '../../utils/util';
import type {
  ITidligereVedtaksperioder,
  IGrunnlagsdataSistePeriodeOvergangsstønad,
} from '../../../typer/dokumentApiBlankett';
import { periodetypeTilTekst } from '../../../typer/dokumentApiBlankett';

export const InntektGrunnlag: React.FC<{
  tidligereVedtaksperioder: ITidligereVedtaksperioder | undefined;
}> = ({ tidligereVedtaksperioder }) => {
  const sistePeriodeMedOvergangsstønad =
    tidligereVedtaksperioder?.sak?.sistePeriodeMedOvergangsstønad;

  if (!sistePeriodeMedOvergangsstønad) {
    return null;
  }

  const skalViseSamordning = sistePeriodeMedOvergangsstønad.samordningsfradrag > 0;

  return (
    <>
      <h3>Registerdata</h3>
      <p>Siste periode med overgangsstønad</p>
      <table>
        <thead>
          <tr>
            <th>Periode</th>
            <th>Type</th>
            <th>Inntekt</th>
            {skalViseSamordning && <th>Samordning</th>}
          </tr>
        </thead>
        <tbody>
          {[sistePeriodeMedOvergangsstønad].map(
            (periode: IGrunnlagsdataSistePeriodeOvergangsstønad, index) => (
              <tr key={index}>
                <td>
                  {formaterIsoDato(periode.fom)} - {formaterIsoDato(periode.tom)}
                </td>
                <td>{periodetypeTilTekst[periode.vedtaksperiodeType]}</td>
                <td>{periode.inntekt ?? 0}</td>
                {skalViseSamordning && <td>{periode.samordningsfradrag}</td>}
              </tr>
            ),
          )}
        </tbody>
      </table>
    </>
  );
};
