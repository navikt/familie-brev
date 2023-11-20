import type { IDelmaler } from '../../../typer/dokumentApiBrev';
import { Feil } from '../Feil';

export default (
  delmaler: IDelmaler | undefined,
  delmalApiNavn: string,
  forelderDokument: string,
  erGjentagende: boolean,
) => {
  if (delmaler) {
    const delmal = delmaler[delmalApiNavn];

    if (delmal !== undefined) {
      if (!Array.isArray(delmal)) {
        throw new Feil(
          `Delmal "${delmalApiNavn}" i "${forelderDokument}" forventer  en liste av strenger, ` +
            `men fikk type ${typeof delmal}:\\n` +
            `${delmal}`,
          400,
        );
      }

      if (!erGjentagende && delmal.length !== 1) {
        throw new Feil(
          `Delmalen "${delmalApiNavn}" i "${forelderDokument}" er ikke gjentagende` +
            `og forventer en liste med nøyaktig ett element,` +
            `men inneholdt ${delmal.length} elementer.`,
          400,
        );
      }

      if (erGjentagende && delmal.length === 0) {
        throw new Feil(
          `Delmalen "${delmalApiNavn}" i "${forelderDokument}" er gjentagede og skal ha minst ett element,` +
            `men inneholdt ${delmal.length} elementer`,
          400,
        );
      }
    }
  }
};
