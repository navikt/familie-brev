import React from 'react';
import { IEnkeltDokumentData } from '../../typer/dokumentApi';
import { hentEnkeltDokumentQuery } from '../sanity/hentDokumentQuery';
import { client, Datasett } from '../sanity/sanityClient';
import useServerEffect from '../utils/useServerEffect';
import flettefeltSerializer from './serializers/enkelFlettefeltSerializer';
import { Maalform } from '../../typer/sanitygrensesnitt';
import enkelDelmalSerializer from './serializers/enkelDelmalSerializer';
import blockSerializer from './serializers/blockSerializer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const BlockContent = require('@sanity/block-content-to-react');

interface EnkeltDokumentProps {
  dokumentApiNavn: string;
  apiEnkeltDokument: IEnkeltDokumentData;
  maalform: Maalform;
  datasett: Datasett;
}

function EnkeltDokument(dokumentProps: EnkeltDokumentProps) {
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
            block: blockSerializer,
            undefined: (_: any) => <div />,
            enkelDelmalBlock: (props: any) =>
              enkelDelmalSerializer(props, apiEnkeltDokument.enkelDelmalData, maalform),
          },
        }}
      />
    );
  }
}

export default EnkeltDokument;
