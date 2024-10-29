import React from 'react';
import { NavIkon } from './ikoner/navIkon';

interface BrevhodeProps {
  tittel: string;
  navn: string;
  fodselsnummer: string;
  brevOpprettetDato: string;
}

export const Brevhode = (props: BrevhodeProps) => {
  const { tittel, navn, fodselsnummer, brevOpprettetDato } = props;

  return (
    <div className={'header'}>
      <div className="ikon-og-dato-wrapper">
        <div className="ikon-og-dato">
          <NavIkon />
          <p>{brevOpprettetDato}</p>
        </div>
      </div>
      <div className={'tittel-og-personinfo'}>
        <h2 className="tittel">{startMedStorBokstav(tittel)}</h2>
        <div className="kolonner">
          <div className="personinfo">
            <div>Navn: {navn}</div>
            <div>Fødselsnummer: {fodselsnummer}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
