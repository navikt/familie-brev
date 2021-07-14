import React from 'react';
import { NavIkon } from './ikoner/navIkon';
import { Flettefelt } from '../../typer/dokumentApi';
import { validerFlettefelt } from '../utils/valideringer/validerFlettefelt';

interface HeaderProps {
  tittel: string;
  navn: Flettefelt;
  fodselsnummer: Flettefelt;
  brevOpprettetDato: Flettefelt;
  visLogo?: boolean;
  apiNavn: string;
}

function Header(props: HeaderProps) {
  const { tittel, navn, fodselsnummer, visLogo, brevOpprettetDato, apiNavn } = props;

  validerFlettefelt(navn, 'navn', apiNavn, false);
  validerFlettefelt(fodselsnummer, 'fodselsnummer', apiNavn, false);
  validerFlettefelt(brevOpprettetDato, 'brevOpprettetDato', apiNavn, false);

  return (
    <div className={'header'}>
      <div className="ikon-og-dato">
        {visLogo && <NavIkon />}
        <p>{brevOpprettetDato[0]}</p>
      </div>
      <div className={'tittel-og-personinfo'}>
        <h2 className="tittel">{tittel.toUpperCase()}</h2>
        <div className="kolonner">
          <div className="personinfo">
            <div>Navn: {navn}</div>
            <div>Fødselsnummer: {fodselsnummer}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
