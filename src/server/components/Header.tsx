import React from 'react';
import { NavIkon } from './ikoner/navIkon';
import {
  Brevmottakere,
  BrevmottakerOrganisasjon,
  BrevmottakerPrivatperson,
  BrevmottakerRolle,
  Flettefelt,
} from '../../typer/dokumentApiBrev';
import { validerFlettefelt } from '../utils/valideringer/validerFlettefelt';
import { Maalform } from '../../typer/sanitygrensesnitt';

interface Props {
  tittel: string;
  navn: Flettefelt;
  fodselsnummer: Flettefelt;
  brevOpprettetDato: Flettefelt;
  visLogo?: boolean;
  apiNavn: string;
  maalform: Maalform;
  datoPlaceholder?: string;
  brevmottakere?: Brevmottakere;
}

export const Header: React.FC<Props> = ({
  tittel,
  navn,
  fodselsnummer,
  visLogo,
  brevOpprettetDato,
  apiNavn,
  maalform,
  datoPlaceholder,
  brevmottakere,
}) => {
  validerFlettefelt(navn, 'navn', apiNavn, false);
  validerFlettefelt(fodselsnummer, 'fodselsnummer', apiNavn, false);
  validerFlettefelt(brevOpprettetDato, 'brevOpprettetDato', apiNavn, false);

  const harVergeEllerFullmektig = utledHarVergeEllerFullmektig(brevmottakere);

  return (
    <div className={'header'}>
      <div className="ikon-og-dato-wrapper">
        <div className="ikon-og-dato">
          {visLogo && <NavIkon />}
          <p>{utledBrevDato(brevOpprettetDato, datoPlaceholder)}</p>
        </div>
      </div>
      <div className={'tittel-og-personinfo'}>
        <h2 className="tittel">{tittel}</h2>
        <div className="kolonner">
          <div className="personinfo">
            <BrevmottakereOrganisasjoner mottakere={brevmottakere?.organisasjoner} />
            <BrevmottakerePrivatpersoner mottakere={brevmottakere?.personer} />
            <div>{utledHvemBrevetGjelderFor(maalform, navn, harVergeEllerFullmektig)}</div>
            <div>Fødselsnummer: {fodselsnummer}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BrevmottakereOrganisasjoner: React.FC<{
  mottakere: BrevmottakerOrganisasjon[] | undefined;
}> = ({ mottakere }) => (
  <>
    {mottakere?.map((organisasjon, index) => (
      <div key={index}>{`Fullmektig: ${organisasjon.navnHosOrganisasjon}`}</div>
    ))}
  </>
);

const BrevmottakerePrivatpersoner: React.FC<{
  mottakere: BrevmottakerPrivatperson[] | undefined;
}> = ({ mottakere }) => (
  <>
    {mottakere
      ?.filter(person => person.mottakerRolle !== BrevmottakerRolle.BRUKER)
      .map((person, index) => (
        <div
          key={index}
        >{`${person.mottakerRolle === BrevmottakerRolle.VERGE ? 'Verge:' : 'Fullmektig:'} ${person.navn}`}</div>
      ))}
  </>
);

const utledHarVergeEllerFullmektig = (brevmottakere: Brevmottakere | undefined) =>
  brevmottakere !== undefined &&
  (brevmottakere.personer.filter(mottaker => mottaker.mottakerRolle !== BrevmottakerRolle.BRUKER)
    .length > 0 ||
    brevmottakere.organisasjoner.length > 0);

const utledBrevDato = (opprettetDato: Flettefelt, placeholder?: string | undefined) =>
  `Dato: ${placeholder || opprettetDato[0]}`;

const utledHvemBrevetGjelderFor = (
  maalform: Maalform,
  navn: Flettefelt,
  harVergeEllerFullmektig: boolean,
): string => {
  if (harVergeEllerFullmektig) {
    switch (maalform) {
      case Maalform.NB:
        return `Saken gjelder: ${navn}`;
      case Maalform.NN:
        return `Saka gjeld: ${navn}`;
    }
  }

  switch (maalform) {
    case Maalform.NB:
      return `Navn: ${navn}`;
    case Maalform.NN:
      return `Namn: ${navn}`;
  }
};
