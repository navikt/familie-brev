import React from 'react';
import { IEnkeltDokumentData } from '../../typer/dokumentApi';
import { hentEnkeltDokumentQuery } from '../sanity/hentDokumentQuery';
import { client, Datasett } from '../sanity/sanityClient';
import useServerEffect from '../utils/useServerEffect';
import flettefeltSerializer from './serializers/flettefeltSerializer';
import { Maalform } from '../../typer/sanitygrensesnitt';
import enkelDelmalSerializer from './serializers/enkelDelmalSerializer';
import blockSerializer from './serializers/blockSerializer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const BlockContent = require('@sanity/block-content-to-react');

interface EnkeltDokumentProps {
  dokumentId: string;
  apiEnkeltDokument: IEnkeltDokumentData;
  maalform: Maalform;
  erEnkeltDokumentmal?: boolean;
  datasett: Datasett;
}

function EnkeltDokument(dokumentProps: EnkeltDokumentProps) {
  const {
    dokumentId,
    apiEnkeltDokument,
    maalform,
    erEnkeltDokumentmal = false,
    datasett,
  } = dokumentProps;
  const dokumentType = erEnkeltDokumentmal ? 'dokumentmal' : 'delmal';

  const [dokument] = useServerEffect(undefined, dokumentId, () => {
    const query = hentEnkeltDokumentQuery(dokumentType, dokumentId, maalform);
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
            block: (props: any) => (
              <div style={{ minHeight: '1rem' }} className={`block`}>
                {props.children}
              </div>
            ),
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
            flettefelt: (props: any) => flettefeltSerializer(props, apiEnkeltDokument.flettefelter),
          },
          types: {
            block: blockSerializer,
            undefined: (_: any) => <div />,
            enkelDelmalBlock: (props: any) =>
              enkelDelmalSerializer(props, apiEnkeltDokument.enkleDelmalData),
          },
        }}
      />
    );
  }
}

export default EnkeltDokument;
