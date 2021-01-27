import { IValgfelter } from '../../../typer/dokumentApi';
import { HttpError } from '../HttpError';

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
