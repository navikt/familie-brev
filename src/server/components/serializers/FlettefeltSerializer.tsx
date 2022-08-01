import type { Flettefelter } from '../../../typer/dokumentApi';
import React from 'react';
import { Feil } from '../../utils/Feil';
import { validerFlettefelt } from '../../utils/valideringer/validerFlettefelt';

interface IFlettefeltSerializerProps {
  sanityProps: any;
  flettefelter: Flettefelter | undefined;
  dokumentApiNavn: string;
}

const FlettefeltSerializer = (props: IFlettefeltSerializerProps) => {
  const { sanityProps, flettefelter, dokumentApiNavn } = props;
  const flettefeltNavn = hentFlettefeltNavn(sanityProps);
  const erListe = hentFlettefeltErListe(sanityProps);

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
    props.sanityProps.children[0].props?.node?.mark === 'hoyrestill';

  validerFlettefelt(flettefelt, flettefeltNavn, dokumentApiNavn, erListe);

  if (erListe) {
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
    return <span className={høyrestill ? 'høyrestill' : ''}>{flettefelt[0]}</span>;
  }
};

const hentFlettefeltNavn = (sanityProps: any) => {
  // Om flettefeltet hentes fra en annotering finnes den i props.mark.
  // Om den hentes fra en block finnes den i props.node.
  const { flettefeltReferanse, felt } = sanityProps.mark || sanityProps.node;

  // Dersom flettefeltet er en referanse ligger det i flettefeltReferanse og må hentes derifra
  const flettefeltNavn = felt ? felt : flettefeltReferanse.felt;
  return flettefeltNavn;
};

const hentFlettefeltErListe = (sanityProps: any) => {
  // Om flettefeltet hentes fra en annotering finnes den i props.mark.
  // Om den hentes fra en block finnes den i props.node.
  const { flettefeltReferanse } = sanityProps.mark || sanityProps.node;
  return flettefeltReferanse ? flettefeltReferanse.erListe : !!sanityProps.node;
};

export default FlettefeltSerializer;
