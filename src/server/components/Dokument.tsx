import React from 'react';
import { IDokumentData, IDokumentDataMedPeriode } from '../../typer/dokumentApi';
import { hentDokumentQuery } from '../sanity/Queries';
import { client, Datasett } from '../sanity/sanityClient';
import useServerEffect from '../utils/useServerEffect';
import { Maalform } from '../../typer/sanitygrensesnitt';
import BlockSerializer from './serializers/BlockSerializer';
import FlettefeltSerializer from './serializers/FlettefeltSerializer';
import PeriodeSerializer from './serializers/PeriodeSerializer';
import DelmalSerializer from './serializers/DelmalSerializer';
import { DokumentType } from '../../typer/dokumentType';
import { Feil } from '../utils/Feil';
import LenkeSerializer from './serializers/LenkeSerializer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const BlockContent = require('@sanity/block-content-to-react');

interface DokumentProps {
  dokumentApiNavn: string;
  dokumentData: IDokumentData | undefined;
  maalform: Maalform;
  datasett: Datasett;
}

const Dokument = (dokumentProps: DokumentProps) => {
  const { dokumentApiNavn, dokumentData, maalform, datasett } = dokumentProps;

  const [dokument] = useServerEffect(undefined, dokumentApiNavn, () => {
    const query = hentDokumentQuery(DokumentType.DOKUMENT, dokumentApiNavn, maalform);
    return client(datasett)
      .fetch(query)
      .then((res: any) => {
        // eslint-disable-next-line no-constant-condition
        if (!res[maalform]) {
          throw new Feil(
            `Fant ikke ${maalform} tekst for "${dokumentApiNavn}" i datasettet "${datasett}".`,
            404,
          );
        }
        return res[maalform];
      });
  });

  if (!dokument) {
    return null;
  }

  return (
    <BlockContent
      blocks={dokument}
      serializers={{
        marks: {
          flettefelt: (props: any) =>
            FlettefeltSerializer({
              sanityProps: props,
              flettefelter: dokumentData?.flettefelter,
              dokumentApiNavn,
            }),
          lenke: LenkeSerializer,
        },
        types: {
          flettefelt: (props: any) =>
            FlettefeltSerializer({
              sanityProps: props,
              flettefelter: dokumentData?.flettefelter,
              dokumentApiNavn,
            }),
          block: BlockSerializer,
          perioder: (props: any) =>
            PeriodeSerializer({
              sanityProps: props,
              periodeData: (dokumentData as IDokumentDataMedPeriode)?.periodeData,
              maalform,
              datasett,
              forelderApiNavn: dokumentApiNavn,
            }),
          undefined: (_: any) => <div />,
          delmal: (props: any) =>
            DelmalSerializer({
              sanityProps: props,
              delmalData: dokumentData?.delmalData,
              maalform,
            }),
        },
      }}
    />
  );
};

export default Dokument;
