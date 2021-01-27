import { client, Datasett } from '../../sanity/sanityClient';
import { Maalform } from '../../../typer/sanitygrensesnitt';
import { Feil } from '../Feil';
import { DokumentType } from '../../../typer/dokumentType';

export default async (
  datasett: Datasett,
  maalform: Maalform,
  dokumentApiNavn: string,
  dokumenttype: DokumentType,
) => {
  if (!Object.values(Datasett).includes(datasett)) {
    throw new Feil(`Datasettet "${datasett}" finnes ikke.`, 404);
  }
  if (!Object.values(Maalform).includes(maalform)) {
    throw new Feil(`Målformen "${maalform}" finnes ikke.`, 404);
  }

  const sanityDokumenter = await client(datasett).fetch(
    `*[_type == "${dokumenttype}" && apiNavn == "${dokumentApiNavn}" ][]`,
  );
  if (sanityDokumenter.length === 0) {
    throw new Feil(`Fant ikke dokument med apiNavn "${dokumentApiNavn}"`, 404);
  }
};
