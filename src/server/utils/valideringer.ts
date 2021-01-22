import { HttpError } from './HttpError';
import { Flettefelt } from '../../typer/dokumentApi';

export const validerFlettefelt = (
  flettefeltVerdi: Flettefelt | undefined,
  flettefeltNavn: string,
  apiNavn: string,
  erListe: boolean,
) => {
  if (flettefeltVerdi === undefined) {
    throw new HttpError(
      `Flettefeltet ${flettefeltNavn} mangler for dokument med Api-navn "${apiNavn}"`,
      400,
    );
  }

  if (!Array.isArray(flettefeltVerdi)) {
    throw new HttpError(
      `Flettefeltet ${flettefeltNavn} i dokument med Api-navn "${apiNavn}" forventer en liste`,
      400,
    );
  }

  if (!erListe && flettefeltVerdi.length !== 1) {
    throw new HttpError(
      `Flettefeltet ${flettefeltNavn} i dokument med Api-navn "${apiNavn}" forventer en liste med nøyaktig ett element,` +
        `men inneholdt ${flettefeltVerdi.length} elementer.`,
      400,
    );
  }
};
