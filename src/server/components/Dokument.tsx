import React from 'react';
import { IDokumentData } from '../../typer/dokumentApi';
import { hentEnkeltDokumentQuery } from '../sanity/hentDokumentQuery';
import { client, Datasett } from '../sanity/sanityClient';
import useServerEffect from '../utils/useServerEffect';
import flettefeltSerializer from './serializers/flettefeltSerializer';
import { Maalform } from '../../typer/sanitygrensesnitt';
import delmalSerializer from './serializers/delmalSerializer';
import blockSerializer from './serializers/blockSerializer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const BlockContent = require('@sanity/block-content-to-react');

interface EnkeltDokumentProps {
  dokumentApiNavn: string;
  apiEnkeltDokument: IDokumentData;
  maalform: Maalform;
  datasett: Datasett;
}

function Dokument(dokumentProps: EnkeltDokumentProps) {
  const { dokumentApiNavn, apiEnkeltDokument, maalform, datasett } = dokumentProps;

  const [dokument] = useServerEffect(undefined, dokumentApiNavn, () => {
    const query = hentEnkeltDokumentQuery('dokument', dokumentApiNavn, maalform);
    return client(datasett)
      .fetch(query)
      .then((res: any) => {
        return res[maalform];
      });
  });

  if (!dokument) {
    return null;
  }

  if (!apiEnkeltDokument) {
    return (
      <BlockContent
        blocks={dokument}
        serializers={{
          types: {
            block: blockSerializer,
            undefined: (_: any) => <div />,
          },
        }}
      />
    );
  } else {
    return (
      <BlockContent
        blocks={dokument}
        serializers={{
          marks: {
            flettefelt: (props: any) =>
              flettefeltSerializer(props, apiEnkeltDokument.flettefelter, dokumentApiNavn),
          },
          types: {
            flettefelt: (props: any) =>
              flettefeltSerializer(props, apiEnkeltDokument.flettefelter, dokumentApiNavn),
            block: blockSerializer,
            undefined: (_: any) => <div />,
            delmal: (props: any) => delmalSerializer(props, apiEnkeltDokument.delmalData, maalform),
          },
        }}
      />
    );
  }
}

export default Dokument;
