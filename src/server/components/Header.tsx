import React from 'react';
import { NavIkon } from './ikoner/navIkon';
import type { Flettefelt } from '../../typer/dokumentApiBrev';
import { validerFlettefelt } from '../utils/valideringer/validerFlettefelt';
import { Maalform } from '../../typer/sanitygrensesnitt';

interface HeaderProps {
  tittel: string;
  navn: Flettefelt;
  fodselsnummer: Flettefelt;
  brevOpprettetDato: Flettefelt;
  visLogo?: boolean;
  apiNavn: string;
  maalform: Maalform;
  organisasjonsnummer?: Flettefelt;
  gjelder?: Flettefelt;
  datoPlaceholder?: string;
}

function Header(props: HeaderProps) {
  const {
    tittel,
    navn,
    fodselsnummer,
    visLogo,
    brevOpprettetDato,
    apiNavn,
    maalform,
    organisasjonsnummer,
    gjelder,
    datoPlaceholder,
  } = props;

  validerFlettefelt(navn, 'navn', apiNavn, false);
  validerFlettefelt(fodselsnummer, 'fodselsnummer', apiNavn, false);
  validerFlettefelt(brevOpprettetDato, 'brevOpprettetDato', apiNavn, false);

  organisasjonsnummer &&
    validerFlettefelt(organisasjonsnummer, 'organisasjonsnummer', apiNavn, false);
  gjelder && validerFlettefelt(gjelder, 'gjelder', apiNavn, false);

  const brevDato = () => {
    return `Dato: ${datoPlaceholder || brevOpprettetDato[0]}`;
  };

  return (
    <div className={'header'}>
      <div className="ikon-og-dato-wrapper">
        <div className="ikon-og-dato">
          {visLogo && <NavIkon />}
          <p>{brevDato()}</p>
        </div>
      </div>
      <div className={'tittel-og-personinfo'}>
        <h2 className="tittel">{tittel}</h2>
        <div className="kolonner">
          <div className="personinfo">
            <div>
              {navnTittel(maalform)}: {navn}
            </div>
            {organisasjonsnummer && <div>Organisasjonsnummer: {organisasjonsnummer}</div>}
            {gjelder && (
              <div>
                {gjelderTittel(maalform)}: {gjelder}
              </div>
            )}
            <div>Fødselsnummer: {fodselsnummer}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const navnTittel = (maalform: Maalform): string => {
  switch (maalform) {
    case Maalform.NB:
      return 'Navn';
    case Maalform.NN:
      return 'Namn';
  }
};

const gjelderTittel = (maalform: Maalform): string => {
  switch (maalform) {
    case Maalform.NB:
      return 'Gjelder';
    case Maalform.NN:
      return 'Gjeld';
  }
};

export default Header;
