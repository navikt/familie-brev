import type { Flettefelter } from '../../../typer/dokumentApiBrev';
import React from 'react';
import { Feil } from '../../utils/Feil';
import { validerFlettefelt } from '../../utils/valideringer/validerFlettefelt';
import { styled } from 'styled-components';

interface IFlettefeltSerializerProps {
  sanityProps: any;
  flettefelter: Flettefelter | undefined;
  dokumentApiNavn: string;
  erListe?: boolean;
}

const StyledParagraph = styled.p`
  white-space: pre-wrap;
`;

export const FlettefeltSerializer = (props: IFlettefeltSerializerProps) => {
  const { sanityProps, flettefelter, dokumentApiNavn, erListe } = props;
  const flettefeltNavn = hentFlettefeltNavn(sanityProps);
  const erFlettefeltListe = hentFlettefeltErListe(sanityProps, erListe);
  const erFlettefeltFritekstfelt = hentFlettefeltErFritekstfelt(sanityProps);

  if (!flettefelter) {
    throw new Feil(
      `Flettefeltet "${flettefeltNavn}" er påkrevd for "${dokumentApiNavn}", ` +
        `men det ble ikke sendt med noen flettefelter.`,
      400,
    );
  }

  const flettefelt = flettefelter[flettefeltNavn];

  const høyrestill =
    Array.isArray(props.sanityProps.children) &&
    props.sanityProps.children.length &&
    props.sanityProps.children[0].props?.markType === 'hoyrestill';

  validerFlettefelt(flettefelt, flettefeltNavn, dokumentApiNavn, erFlettefeltListe);

  if (erFlettefeltListe) {
    return (
      <ul>
        {flettefelt.map((felt, index) => (
          <li key={index} className={`block`}>
            {felt}
          </li>
        ))}
      </ul>
    );
  } else if (erFlettefeltFritekstfelt) {
    return (
      <span className={høyrestill ? 'høyrestill' : ''}>
        {flettefelt[0].split('\n\n').map((avsnitt, index) => (
          <StyledParagraph key={index}>{avsnitt}</StyledParagraph>
        ))}
      </span>
    );
  } else {
    return <span className={høyrestill ? 'høyrestill' : ''}>{flettefelt[0]}</span>;
  }
};

const hentFlettefeltNavn = (sanityProps: any) => {
  const { flettefeltReferanse, felt } = sanityProps.value;

  // Dersom flettefeltet er en referanse ligger det i flettefeltReferanse og må hentes derifra
  const flettefeltNavn = felt ? felt : flettefeltReferanse.felt;
  return flettefeltNavn;
};

const hentFlettefeltErListe = (sanityProps: any, erBegrunnelse?: boolean) => {
  const { flettefeltReferanse } = sanityProps.value;
  return !!(flettefeltReferanse?.erListe || erBegrunnelse);
};

const hentFlettefeltErFritekstfelt = (sanityProps: any) => {
  return sanityProps.value.flettefeltReferanse?.erFritektsfelt == true;
};
