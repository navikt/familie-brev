import React, { Fragment } from 'react';
import { Maalform } from '../../../typer/sanitygrensesnitt';
import type { UtbetalingerPerMndEøs } from '../../../typer/utbetalingerEøs';
import { YtelseType } from '../../../typer/utbetalingerEøs';
import { css, styled } from 'styled-components';
import { formaterBeløpMedPostfix } from '../../utils/util';

interface UtbetalingerProps {
  maalform: Maalform;
  utbetalingerPerMndEøs: UtbetalingerPerMndEøs;
}

interface TabellHeader {
  barnetrygd: string;
  månedÅr: string;
  satsINorge: string;
  utbetaltFraAnnetLand: string;
  utbetaltFraNorge: string;
}

const TabellHeaderForSpraak: Record<Maalform, TabellHeader> = {
  [Maalform.NB]: {
    barnetrygd: 'Barnetrygd',
    månedÅr: 'Måned - år',
    satsINorge: 'Sats i Norge',
    utbetaltFraAnnetLand: 'Utbetalt fra annet land',
    utbetaltFraNorge: 'Utbetalt fra Norge',
  },
  [Maalform.NN]: {
    barnetrygd: 'Barnetrygd',
    månedÅr: 'Måned - år',
    satsINorge: 'Sats i Noreg',
    utbetaltFraAnnetLand: 'Utbetalt frå anna land',
    utbetaltFraNorge: 'Utbetalt frå Noreg',
  },
};

const YtelseTypeText: Record<YtelseType, string> = {
  [YtelseType.ORDINÆR_BARNETRYGD]: 'Ordinær barnetrygd',
  [YtelseType.UTVIDET_BARNETRYGD]: 'Utvidet barnetrygd',
  [YtelseType.SMÅBARNSTILLEGG]: 'Småbarnstillegg',
};

const barnetrygdTekst = (fnr: string, ytelseType: YtelseType) => {
  if (ytelseType === YtelseType.ORDINÆR_BARNETRYGD) {
    return `Barn ${formatterFnr(fnr)}`;
  } else {
    return YtelseTypeText[ytelseType];
  }
};

const formatterFnr = (fnr: string) => {
  if (fnr.length === 11) {
    return `${fnr.substring(0, 6)} ${fnr.substring(6)}`;
  }
  return fnr;
};

const ZebraStripedTable = styled.table`
  border: none;
  width: 100%;

  tbody tr:nth-child(odd) {
    background-color: #f2f3f5;
  }
`;

const CommonCellCSS = css`
  border: none;
  display: table-cell;
  padding: 0.25rem 0.5rem;
  font-family:
    Source Sans Pro,
    sans-serif;
  font-size: 12pt;
  letter-spacing: 0;
  line-height: 1.5rem;
  margin: 0;
  border-bottom: 1px solid #838c9a;
`;

const StyledTableData = styled.td<{ $borderTop?: boolean }>`
  ${CommonCellCSS};
  font-weight: 400;
`;

const StyledTableHeader = styled.th`
  ${CommonCellCSS};
  border-bottom: 2px solid #838c9a;
  font-weight: 600;
`;

const StyledTableDataRow = styled.tr<{ $borderTop?: boolean }>`
    ${StyledTableData} {
        border-top: ${props => (props.$borderTop ? '2px solid #838c9a' : 'none')};
    }
}
`;

const SummaryTableRow = styled.tr`
  td {
    font-weight: bold;
  }
`;

export const UtbetalingerSerializer = (props: UtbetalingerProps) => {
  const { maalform, utbetalingerPerMndEøs } = props;

  const header = TabellHeaderForSpraak[maalform];

  return (
    <ZebraStripedTable>
      <thead>
        <tr>
          <StyledTableHeader align="left" scope="col">
            {header.barnetrygd}
          </StyledTableHeader>
          <StyledTableHeader align="left" scope="col">
            {header.månedÅr}
          </StyledTableHeader>
          <StyledTableHeader align="right" scope="col">
            {header.satsINorge}
          </StyledTableHeader>
          <StyledTableHeader align="right" scope="col">
            {header.utbetaltFraAnnetLand}
          </StyledTableHeader>
          <StyledTableHeader align="right" scope="col">
            {header.utbetaltFraNorge}
          </StyledTableHeader>
        </tr>
      </thead>
      <tbody>
        {Object.entries(utbetalingerPerMndEøs).map(([mndÅr, utbetalingMndEøs]) => {
          const harFlereYtelserIPeriode = utbetalingMndEøs.utbetalinger.length > 1;
          return (
            <Fragment key={mndÅr}>
              {utbetalingMndEøs.utbetalinger.map((utbetalingEØS, index) => (
                <StyledTableDataRow
                  $borderTop={harFlereYtelserIPeriode && index === 0}
                  key={mndÅr + '-' + index}
                >
                  <StyledTableData align="left">
                    {barnetrygdTekst(utbetalingEØS.fnr, utbetalingEØS.ytelseType)}
                  </StyledTableData>
                  <StyledTableData align="left">{mndÅr}</StyledTableData>
                  <StyledTableData align="right">
                    {formaterBeløpMedPostfix(utbetalingEØS.satsINorge, 'NOK')}
                  </StyledTableData>
                  <StyledTableData align="right">
                    {utbetalingEØS.utbetaltFraAnnetLand
                      ? `${formaterBeløpMedPostfix(utbetalingEØS.utbetaltFraAnnetLand.beløp, utbetalingEØS.utbetaltFraAnnetLand.valutakode)} / ${formaterBeløpMedPostfix(utbetalingEØS.utbetaltFraAnnetLand.beløpINok, 'NOK')}`
                      : '-'}
                  </StyledTableData>
                  <StyledTableData align="right">
                    {formaterBeløpMedPostfix(utbetalingEØS.utbetaltFraNorge, 'NOK')}
                  </StyledTableData>
                </StyledTableDataRow>
              ))}
              {harFlereYtelserIPeriode && (
                <SummaryTableRow key={mndÅr + 'oppsummering'}>
                  <StyledTableData align="left">Totalt i:</StyledTableData>
                  <StyledTableData align="left">{mndÅr}</StyledTableData>
                  <StyledTableData align="right">
                    {formaterBeløpMedPostfix(
                      utbetalingMndEøs.oppsummering.summertSatsINorge,
                      'NOK',
                    )}
                  </StyledTableData>
                  <StyledTableData align="right">
                    {utbetalingMndEøs.oppsummering.summertUtbetaltFraAnnetLand
                      ? formaterBeløpMedPostfix(
                          utbetalingMndEøs.oppsummering.summertUtbetaltFraAnnetLand,
                          'NOK',
                        )
                      : '-'}
                  </StyledTableData>
                  <StyledTableData align="right">
                    {formaterBeløpMedPostfix(
                      utbetalingMndEøs.oppsummering.summertUtbetaltFraNorge,
                      'NOK',
                    )}
                  </StyledTableData>
                </SummaryTableRow>
              )}
            </Fragment>
          );
        })}
      </tbody>
    </ZebraStripedTable>
  );
};
