import React from 'react';
import { css, styled } from 'styled-components';
import { dagensDatoFormatert } from '../../utils/util';

interface HeaderProps {
  saksid: string;
  personident: string;
  navn: string;
  saksbehandlernavn: string;
  enhet: string;
  årstall: number;
}

const CommonCellCSS = css`
  display: table-cell;
  font-family:
    Source Sans Pro,
    sans-serif;
  font-size: 12pt;
  letter-spacing: 0;
  margin: 0;
  border: 1px solid #838c9a;
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

export function Header(props: HeaderProps) {
  const { saksid, personident, navn, saksbehandlernavn, enhet, årstall } = props;

  return (
    <div>
      <h1>Notat av {dagensDatoFormatert()}</h1>
      <table>
        <StyledTableHeader colSpan={3}>Saksnummer: {saksid}</StyledTableHeader>
        <StyledTableDataRow>
          <StyledTableData>
            <b>Hvem saken gjelder</b>
          </StyledTableData>
          <StyledTableData>Navn: {navn}</StyledTableData>
          <StyledTableData>Fødselsnummer: {personident}</StyledTableData>
        </StyledTableDataRow>
        <StyledTableDataRow>
          <StyledTableData>
            <b>Saksbehandler(e)</b>
          </StyledTableData>
          <StyledTableData>Navn: {saksbehandlernavn}</StyledTableData>
          <StyledTableData>Enhet: {enhet}</StyledTableData>
        </StyledTableDataRow>
        <StyledTableDataRow>
          <StyledTableData>Saken gjelder:</StyledTableData>
          <StyledTableData colSpan={2}>Vurdering næringsinntekt {årstall}</StyledTableData>
        </StyledTableDataRow>
      </table>
    </div>
  );
}
