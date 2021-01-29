import { IPeriodeData } from '../../../typer/dokumentApi';
import { Feil } from '../Feil';

export const validerPeriode = (forelderDokument: string, periodeData?: IPeriodeData) => {
  if (!periodeData) {
    throw new Feil(
      `"${forelderDokument}" skal ha mist én periode, men hadde ingen perioder i perodeData.`,
      400,
    );
  }
};
