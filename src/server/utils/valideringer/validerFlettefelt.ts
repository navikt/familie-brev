import { Feil } from '../Feil';
import type { Flettefelt } from '../../../typer/dokumentApi';

export const validerFlettefelt = (
  flettefeltVerdi: Flettefelt | undefined,
  flettefeltNavn: string,
  apiNavn: string,
  erListe: boolean,
) => {
  if (flettefeltVerdi === undefined) {
    throw new Feil(`Flettefeltet "${flettefeltNavn}" mangler for "${apiNavn}"`, 400);
  }

  if (!Array.isArray(flettefeltVerdi)) {
    throw new Feil(`Flettefeltet "${flettefeltNavn}" i "${apiNavn}" forventer en liste`, 400);
  }

  if (!erListe && flettefeltVerdi.length !== 1) {
    throw new Feil(
      `Flettefeltet "${flettefeltNavn}" i "${apiNavn}" forventer en liste med nøyaktig ett element, ` +
        `men inneholdt ${flettefeltVerdi.length} elementer.`,
      400,
    );
  }
};
