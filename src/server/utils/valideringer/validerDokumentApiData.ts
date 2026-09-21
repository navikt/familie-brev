import { Datasett } from '../../sanity/sanityClient.js';
import { Maalform } from '../../../typer/sanitygrensesnitt.js';
import { Feil } from '../Feil.js';

export const validerDokumentApiData = async (datasett: Datasett, maalform: Maalform) => {
  if (!Object.values(Datasett).includes(datasett)) {
    throw new Feil(`Datasettet "${datasett}" finnes ikke.`, 404);
  }
  if (!Object.values(Maalform).includes(maalform)) {
    throw new Feil(`Målformen "${maalform}" finnes ikke.`, 404);
  }
};
