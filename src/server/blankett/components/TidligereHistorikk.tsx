import React from 'react';
import type {
  IGrunnlagsdataPeriodeHistorikkBarnetilsyn,
  IGrunnlagsdataPeriodeHistorikkOvergangsstønad,
  ITidligereVedtaksperioder,
  OverlappMedOvergangsstønad,
} from '../../../typer/dokumentApiBlankett';
import { EPeriodetype, periodetypeTilTekst } from '../../../typer/dokumentApiBlankett';
import { formaterIsoDato, mapBooleanTilString } from '../../utils/util';

export const TidligereHistorikk: React.FC<{
  tidligereVedtaksperioder: ITidligereVedtaksperioder | undefined;
}> = ({ tidligereVedtaksperioder }) => {
  const periodeHistorikkOvergangsstønad =
    tidligereVedtaksperioder?.sak?.periodeHistorikkOvergangsstønad;
  const periodeHistorikkBarnetilsyn = tidligereVedtaksperioder?.sak?.periodeHistorikkBarnetilsyn;

  return (
    <>
      <h3 className={'blankett'}>Registerdata</h3>
      <p>Har bruker tidligere vedtaksperioder i EF Sak eller Infotrygd?</p>
      <h3 className={'blankett'}>Overgangsstønad</h3>
      <div>
        <strong>Historikk i EF Sak:</strong>{' '}
        {mapBooleanTilString(tidligereVedtaksperioder?.sak?.harTidligereOvergangsstønad)}
      </div>
      <div>
        <strong>Historikk i Infotrygd:</strong>{' '}
        {mapBooleanTilString(tidligereVedtaksperioder?.infotrygd.harTidligereOvergangsstønad)}
      </div>
      <TidligereHistorikkOvergangsstønadTabell
        periodeHistorikkOvergangsstønad={periodeHistorikkOvergangsstønad}
      />
      <h3 className={'blankett'}>Barnetilsyn</h3>
      <div>
        <strong>Historikk i EF Sak:</strong>{' '}
        {mapBooleanTilString(tidligereVedtaksperioder?.sak?.harTidligereBarnetilsyn)}
      </div>
      <div>
        <strong>Historikk i Infotrygd:</strong>{' '}
        {mapBooleanTilString(tidligereVedtaksperioder?.infotrygd.harTidligereBarnetilsyn)}
      </div>
      <TidligereHistorikkBarnetilsynTabell
        periodeHistorikkBarnetilsyn={periodeHistorikkBarnetilsyn}
      />
      <h3 className={'blankett'}>Skolepenger</h3>
      <div>
        <strong>Historikk i EF Sak:</strong>{' '}
        {mapBooleanTilString(tidligereVedtaksperioder?.sak?.harTidligereSkolepenger)}
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

const TidligereHistorikkOvergangsstønadTabell: React.FC<{
  periodeHistorikkOvergangsstønad: IGrunnlagsdataPeriodeHistorikkOvergangsstønad[] | undefined;
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
      {periodeHistorikkOvergangsstønad?.map((periode, index) => {
        return (
          <tr key={periode.fom + index}>
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
const TidligereHistorikkBarnetilsynTabell: React.FC<{
  periodeHistorikkBarnetilsyn: IGrunnlagsdataPeriodeHistorikkBarnetilsyn[] | undefined;
}> = ({ periodeHistorikkBarnetilsyn }) => {
  if (!periodeHistorikkBarnetilsyn || periodeHistorikkBarnetilsyn?.length < 1) return <></>;

  return (
    <table>
      <tr>
        <th>Periode</th>
        <th>Overlapper med overgangsstønad</th>
      </tr>
      {periodeHistorikkBarnetilsyn?.map((periode, index) => {
        return (
          <tr key={periode.fom + index}>
            <td>
              {formaterIsoDato(periode.fom)} - {formaterIsoDato(periode.tom)}
            </td>
            <td>
              {overlappMedOvergangsstønadTilTekst[periode.overlapperMedOvergangsstønad || '']}
            </td>
          </tr>
        );
      })}
    </table>
  );
};
export const overlappMedOvergangsstønadTilTekst: Record<OverlappMedOvergangsstønad | '', string> = {
  JA: 'Ja, hele perioden',
  DELVIS: 'Ja, deler av perioden',
  NEI: 'Nei',
  '': '',
};
