import { HttpError } from './HttpError';
import { Flettefelt, IDelmaler, IValgfelter } from '../../typer/dokumentApi';

export const validerFlettefelt = (
  flettefeltVerdi: Flettefelt | undefined,
  flettefeltNavn: string,
  apiNavn: string,
  erListe: boolean,
) => {
  if (flettefeltVerdi === undefined) {
    throw new HttpError(
      `Flettefeltet "${flettefeltNavn}" mangler for dokument med Api-navn "${apiNavn}"`,
      400,
    );
  }

  if (!Array.isArray(flettefeltVerdi)) {
    throw new HttpError(
      `Flettefeltet "${flettefeltNavn}" i dokument med Api-navn "${apiNavn}" forventer en liste`,
      400,
    );
  }

  if (!erListe && flettefeltVerdi.length !== 1) {
    throw new HttpError(
      `Flettefeltet "${flettefeltNavn}" i dokument med Api-navn "${apiNavn}" forventer en liste med nøyaktig ett element, ` +
        `men inneholdt ${flettefeltVerdi.length} elementer.`,
      400,
    );
  }
};

export const validerValgfelt = (
  valgfelter: IValgfelter | undefined,
  valgfeltApiNavn: string,
  skalAlltidMed: boolean,
  forelderDokument: string,
  erGjentagende: boolean,
) => {
  if (!valgfelter && skalAlltidMed) {
    throw new HttpError(
      `Ingen valgfelter ble gitt inn til "${forelderDokument}", ` +
        `men valgfeltet "${valgfeltApiNavn}" er påkrevd`,
      400,
    );
  }

  if (valgfelter) {
    const valgfelt = valgfelter[valgfeltApiNavn];

    if (valgfelt === undefined && skalAlltidMed) {
      throw new HttpError(`Valgfeltet "${valgfeltApiNavn}" mangler for "${forelderDokument}"`, 400);
    }

    if (valgfelt !== undefined) {
      if (!Array.isArray(valgfelt)) {
        throw new HttpError(
          `Valgfeltet "${valgfeltApiNavn}" i "${valgfeltApiNavn}" forventer en liste, men fikk ${typeof valgfelt}`,
          400,
        );
      }

      if (!erGjentagende && valgfelt.length !== 1) {
        throw new HttpError(
          `Valgfeltet "${valgfeltApiNavn}" i "${forelderDokument}" er ikke gjentagende` +
            `og forventer en liste med nøyaktig ett element,` +
            `men inneholdt ${valgfelt.length} elementer.`,
          400,
        );
      }

      if (erGjentagende && valgfelt.length === 0) {
        throw new HttpError(
          `Valgfeltet "${valgfeltApiNavn}" i "${forelderDokument}" er gjentagede og skal ha minst ett element,` +
            `men inneholdt ${valgfelt.length} elementer`,
          400,
        );
      }
    }
  }
};

export const validerDelmal = (
  delmaler: IDelmaler | undefined,
  delmalApiNavn: string,
  forelderDokument: string,
  erGjentagende: boolean,
) => {
  if (delmaler) {
    const delmal = delmaler[delmalApiNavn];

    if (delmal !== undefined) {
      if (!Array.isArray(delmal)) {
        throw new HttpError(
          `Delmal "${delmalApiNavn}" i "${forelderDokument}" forventer  en liste av strenger, ` +
            `men fikk type ${typeof delmal}:\\n` +
            `${delmal}`,
          400,
        );
      }

      if (!erGjentagende && delmal.length !== 1) {
        throw new HttpError(
          `Delmalen "${delmalApiNavn}" i "${forelderDokument}" er ikke gjentagende` +
            `og forventer en liste med nøyaktig ett element,` +
            `men inneholdt ${delmal.length} elementer.`,
          400,
        );
      }

      if (erGjentagende && delmal.length === 0) {
        throw new HttpError(
          `Delmalen "${delmalApiNavn}" i "${forelderDokument}" er gjentagede og skal ha minst ett element,` +
            `men inneholdt ${delmal.length} elementer`,
          400,
        );
      }
    }
  }
};
