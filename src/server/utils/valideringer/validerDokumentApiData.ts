import { client, Datasett } from '../../sanity/sanityClient';
import { Maalform } from '../../../typer/sanitygrensesnitt';
import { HttpError } from '../HttpError';
import { DokumentType } from '../../../typer/dokumentType';

export default async (
  datasett: Datasett,
  maalform: Maalform,
  dokumentApiNavn: string,
  dokumenttype: DokumentType,
) => {
  if (!Object.values(Datasett).includes(datasett)) {
    throw new HttpError(`Datasettet "${datasett}" finnes ikke.`, 404);
  }
  if (!Object.values(Maalform).includes(maalform)) {
    throw new HttpError(`Målformen "${maalform}" finnes ikke.`, 404);
  }

  const sanityDokumenter = await client(datasett).fetch(
    `*[_type == "${dokumenttype}" && apiNavn == "${dokumentApiNavn}" ][]`,
  );
  if (sanityDokumenter.length === 0) {
    throw new HttpError(`Fant ikke dokument med apiNavn "${dokumentApiNavn}"`, 404);
  }
};
