import React from 'react';
import { NavIkonUtenSirkel } from './ikoner/NavIkonUtenSirkel';

interface BrevhodeProps {
  navn: string;
  fødselsnummer: string;
  brevOpprettetDato: string;
}

export const BrevhodeBaks = ({ navn, fødselsnummer, brevOpprettetDato }: BrevhodeProps) => {
  return (
    <header>
      <div className={'nav-ikon'}>
        <NavIkonUtenSirkel />
      </div>
      <table className={'person-og-saksinfo'}>
        <tbody>
          <tr>
            <th>Navn:</th>
            <td>{navn}</td>
          </tr>
          <tr>
            <th>Fødselsnummer:</th>
            <td>{fødselsnummer}</td>
            <td className="dato">{brevOpprettetDato}</td>
          </tr>
        </tbody>
      </table>
    </header>
  );
};
