import React from 'react';
import { NavIkonUtenSirkel } from './ikoner/NavIkonUtenSirkel';
import { BrevmottakerOrganisasjon } from '../../typer/dokumentApiBrev';
import { formaterOrgNummer } from '../utils/util';

interface BrevhodeProps {
  navn: string;
  fødselsnummer: string;
  brevOpprettetDato: string;
  institusjon?: BrevmottakerOrganisasjon;
}

export const BrevhodeBaks = ({
  navn,
  fødselsnummer,
  brevOpprettetDato,
  institusjon,
}: BrevhodeProps) => {
  return (
    <header>
      <div className={'nav-ikon'}>
        <NavIkonUtenSirkel />
      </div>
      <table className={'person-og-saksinfo'}>
        <tbody>
          {institusjon ? (
            <>
              <tr>
                <th>Navn:</th>
                <td>{institusjon.organisasjonsnavn}</td>
              </tr>
              <tr>
                <th>Organisasjonsnummer:</th>
                <td>{formaterOrgNummer(institusjon.organisasjonsnummer)}</td>
              </tr>
              <tr>
                <th>Gjelder:</th>
                <td>{navn}</td>
              </tr>
              <tr>
                <th>Fødselsnummer:</th>
                <td>{fødselsnummer}</td>
                <td className="dato">{brevOpprettetDato}</td>
              </tr>
            </>
          ) : (
            <>
              <tr>
                <th>Navn:</th>
                <td>{navn}</td>
              </tr>
              <tr>
                <th>Fødselsnummer:</th>
                <td>{fødselsnummer}</td>
                <td className="dato">{brevOpprettetDato}</td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </header>
  );
};
