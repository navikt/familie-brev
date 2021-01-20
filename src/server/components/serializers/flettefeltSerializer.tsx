import { Flettefelter } from '../../../typer/dokumentApi';
import React from 'react';

const flettefeltSerializer = (
  props: any,
  flettefelter: Flettefelter | undefined,
  dokumentApiNavn: string,
) => {
  // Om flettefeltet hentes fra en annotering finnes den i props.mark.
  // Om den hentes fra en block finnes den i props.node.
  const { flettefeltReferanse } = props.mark || props.node;
  const flettefeltNavn = flettefeltReferanse.felt;

  if (!flettefelter || !flettefelter[flettefeltNavn]) {
    throw Error(
      `Flettefeltet ${flettefeltNavn} er påkrevd for dokument med Api-navn "${dokumentApiNavn}"`,
    );
  }

  const flettefelt = flettefelter[flettefeltNavn];

  if (!Array.isArray(flettefelt)) {
    throw Error(`Flettefeltet ${flettefeltNavn} er ikke en liste"`);
  }

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
    if (flettefelt.length !== 1) {
      throw Error(
        `Flettefeltet ${flettefeltNavn} i dokument med Api-navn "${dokumentApiNavn}" forventer en liste med nøyaktig et element`,
      );
    }

    return flettefelt[0];
  }
};

export default flettefeltSerializer;
