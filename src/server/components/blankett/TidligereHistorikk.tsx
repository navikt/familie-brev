import React from 'react';
import type { IGrunnlagsdataPeriodeHistorikk } from '../../../typer/dokumentApi';
import {
  periodetypeTilTekst,
  type ITidligereVedtaksperioder,
  EPeriodetype,
} from '../../../typer/dokumentApi';
import { mapBooleanTilString } from '../../utils/util';
import { formaterIsoDato } from '../../../utils/dato';

export const TidligereHistorikk: React.FC<{
  tidligereVedtaksperioder: ITidligereVedtaksperioder | undefined;
}> = ({ tidligereVedtaksperioder }) => {
  const periodeHistorikkOvergangsstønad =
    tidligereVedtaksperioder?.sak.periodeHistorikkOvergangsstønad;

  const TidligereHistorikk: React.FC = () => {
    return (
      <>
        <p>Har bruker tidligere vedtaksperioder i EF Sak eller Infotrygd?</p>
        <h3>Overgangsstønad</h3>
        <div>
          <strong>Historikk i EF Sak:</strong>{' '}
          {mapBooleanTilString(tidligereVedtaksperioder?.sak.harTidligereOvergangsstønad)}
        </div>
        <div>
          <strong>Historikk i Infotrygd:</strong>{' '}
          {mapBooleanTilString(tidligereVedtaksperioder?.infotrygd.harTidligereOvergangsstønad)}
        </div>
        <TidligereHistorikkOvergangsstønadTabell
          periodeHistorikkOvergangsstønad={periodeHistorikkOvergangsstønad}
        />
        <h3>Barnetilsyn</h3>
        <div>
          <strong>Historikk i EF Sak:</strong>{' '}
          {mapBooleanTilString(tidligereVedtaksperioder?.sak.harTidligereBarnetilsyn)}
        </div>
        <div>
          <strong>Historikk i Infotrygd:</strong>{' '}
          {mapBooleanTilString(tidligereVedtaksperioder?.infotrygd.harTidligereBarnetilsyn)}
        </div>
        <h3>Skolepenger</h3>
        <div>
          <strong>Historikk i EF Sak:</strong>{' '}
          {mapBooleanTilString(tidligereVedtaksperioder?.sak.harTidligereSkolepenger)}
        </div>
        <div>
          <strong>Historikk i Infotrygd:</strong>{' '}
          {mapBooleanTilString(tidligereVedtaksperioder?.infotrygd.harTidligereSkolepenger)}
        </div>
        <br />
        <div>
          <strong>Har bruker fått stønad før desember 2008 - Infotrygd (PE PP): </strong>
          {mapBooleanTilString(tidligereVedtaksperioder?.historiskPensjon)}
        </div>
      </>
    );
  };

  return (
    <>
      <h3>Registerdata</h3>
      <TidligereHistorikk />
    </>
  );
};

const TidligereHistorikkOvergangsstønadTabell: React.FC<{
  periodeHistorikkOvergangsstønad: IGrunnlagsdataPeriodeHistorikk[] | undefined;
}> = ({ periodeHistorikkOvergangsstønad }) => {
  if (!periodeHistorikkOvergangsstønad || periodeHistorikkOvergangsstønad?.length < 1) return <></>;

  return (
    <table>
      <tr>
        <th>Periode</th>
        <th>Periodetype</th>
        <th>Måneder med utbet.</th>
        <th>Måneder uten utbet.</th>
      </tr>
      {periodeHistorikkOvergangsstønad?.map((periode, i) => {
        return (
          <tr key={i}>
            <td>
              {formaterIsoDato(periode.fom)} - {formaterIsoDato(periode.tom)}
            </td>
            <td>{periodetypeTilTekst[periode.vedtaksperiodeType] || ''}</td>
            <td>{periode.antallMåneder}</td>
            <td>
              {periode.antallMånederUtenBeløp >= 1 &&
              periode.vedtaksperiodeType !== EPeriodetype.SANKSJON
                ? periode.antallMånederUtenBeløp
                : '-'}
            </td>
          </tr>
        );
      })}
    </table>
  );
};
