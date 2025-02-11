import type { Flettefelter } from '../../../typer/dokumentApiBrev';
import React from 'react';
import { Feil } from '../../utils/Feil';
import { validerFlettefelt } from '../../utils/valideringer/validerFlettefelt';

interface IFlettefeltSerializerProps {
  sanityProps: any;
  flettefelter: Flettefelter | undefined;
  dokumentApiNavn: string;
  erListe?: boolean;
}

export const FlettefeltSerializer = (props: IFlettefeltSerializerProps) => {
  const { sanityProps, flettefelter, dokumentApiNavn, erListe } = props;
  const flettefeltNavn = hentFlettefeltNavn(sanityProps);
  const erFlettefeltListe = hentFlettefeltErListe(sanityProps, erListe);

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
  } else {
    return konverterFlettefeltTekstMedNewLineTilBrTag(flettefelt[0], høyrestill);
  }
};

/**
 * Skal ikke ha en ekstra linjeskift på slutten av hvert avsnitt
 * Dersom siste element er ikke er "tomt" (som betyr \n) så skippes <br />-taggen
 */
const konverterFlettefeltTekstMedNewLineTilBrTag = (
  flettefeltElement: string,
  høyrestill: boolean,
) => {
  return flettefeltElement?.split('\n').map((avsnitt, index, total) => {
    const erSisteElement = total.length - 1 === index;
    const erLinjeskiftElement = avsnitt.length === 0;
    const skalHaBreaklineTag = erLinjeskiftElement || !erSisteElement;
    return (
      <React.Fragment key={index}>
        <span className={høyrestill ? 'høyrestill' : ''}>{avsnitt}</span>
        {skalHaBreaklineTag && <br />}
      </React.Fragment>
    );
  });
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
