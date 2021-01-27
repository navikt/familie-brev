import { Flettefelter } from '../../../typer/dokumentApi';
import React from 'react';
import { Feil } from '../../utils/Feil';
import { validerFlettefelt } from '../../utils/valideringer/validerFlettefelt';

const flettefeltSerializer = (
  props: any,
  flettefelter: Flettefelter | undefined,
  dokumentApiNavn: string,
) => {
  // Om flettefeltet hentes fra en annotering finnes den i props.mark.
  // Om den hentes fra en block finnes den i props.node.
  const { flettefeltReferanse } = props.mark || props.node;
  const flettefeltNavn = flettefeltReferanse.felt;

  if (!flettefelter) {
    throw new Feil(
      `Flettefeltet "${flettefeltNavn}" er påkrevd for "${dokumentApiNavn}", ` +
        `men det ble ikke sendt med noen flettefelter.`,
      400,
    );
  }

  const flettefelt = flettefelter[flettefeltNavn];

  validerFlettefelt(flettefelt, flettefeltNavn, dokumentApiNavn, flettefeltReferanse.erListe);

  if (flettefeltReferanse.erListe) {
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
    return flettefelt[0];
  }
};

export default flettefeltSerializer;
