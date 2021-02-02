import { Feil } from '../Feil';
import { Flettefelter } from '../../../typer/dokumentApi';

export const validerPeriode = (forelderDokument: string, periodeData?: Flettefelter[]) => {
  if (!periodeData || periodeData.length === 0) {
    throw new Feil(
      `"${forelderDokument}" skal ha mist én periode, men hadde ingen perioder i perodeData.`,
      400,
    );
  }
  periodeData.forEach(periode => {
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
