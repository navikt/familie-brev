import { Feil } from '../Feil';
import type { IPeriodedata } from '../../../baks/typer';

export const validerPeriode = (forelderDokument: string, periodedata?: IPeriodedata[]) => {
  if (!periodedata || periodedata.length === 0) {
    throw new Feil(
      `"${forelderDokument}" skal ha minst én periode, men hadde ingen perioder i periodeData.`,
      400,
    );
  }
  periodedata.forEach(periode => {
    if (!periode.type) {
      throw new Feil(`"${forelderDokument}" fikk inn en periode uten type.`, 400);
    }

    if (!Array.isArray(periode.type) || periode.type.length !== 1) {
      throw new Feil(
        `Periodetypene til "${forelderDokument}" skal være en liste med lengde én.`,
        400,
      );
    }
  });
};
