import React from 'react';
import { css, styled } from 'styled-components';

interface HeaderProps {
  personident: string;
  navn: string;
  saksbehandlernavn: string;
  enhet: string;
  tittel: string;
  årstall: number;
}

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

export function Header(props: HeaderProps) {
  const { personident, navn, saksbehandlernavn, enhet, tittel, årstall } = props;

  return (
    <div>
      <h1>{tittel}</h1>
      <StyledTableData>
        <StyledTableHeader>Saksnummer: GENERELL_SAK</StyledTableHeader>
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
          <StyledTableData>Vurdering næringsinntekt {årstall}</StyledTableData>
        </StyledTableDataRow>
      </StyledTableData>
    </div>
  );
}
