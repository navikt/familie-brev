import { Datasett } from '../../sanity/sanityClient';
import { Maalform } from '../../../typer/sanitygrensesnitt';
import { Feil } from '../Feil';

export default async (datasett: Datasett, maalform: Maalform) => {
  if (!Object.values(Datasett).includes(datasett)) {
    throw new Feil(`Datasettet "${datasett}" finnes ikke.`, 404);
  }
  if (!Object.values(Maalform).includes(maalform)) {
    throw new Feil(`Målformen "${maalform}" finnes ikke.`, 404);
  }
};
