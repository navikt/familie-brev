import React from 'react';
import { IDokumentData } from '../../typer/dokumentApi';
import { hentDokumentQuery } from '../sanity/Queries';
import { client, Datasett } from '../sanity/sanityClient';
import useServerEffect from '../utils/useServerEffect';
import flettefeltSerializer from './serializers/flettefeltSerializer';
import { Maalform } from '../../typer/sanitygrensesnitt';
import delmalSerializer from './serializers/delmalSerializer';
import blockSerializer from './serializers/blockSerializer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const BlockContent = require('@sanity/block-content-to-react');

interface DokumentProps {
  dokumentApiNavn: string;
  dokumentData: IDokumentData;
  maalform: Maalform;
  datasett: Datasett;
}

function Dokument(dokumentProps: DokumentProps) {
  const { dokumentApiNavn, dokumentData, maalform, datasett } = dokumentProps;

  const [dokument] = useServerEffect(undefined, dokumentApiNavn, () => {
    const query = hentDokumentQuery('dokument', dokumentApiNavn, maalform);
    return client(datasett)
      .fetch(query)
      .then((res: any) => {
        return res[maalform];
      });
  });

  if (!dokument) {
    return null;
  }

  if (!dokumentData) {
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
              flettefeltSerializer(props, dokumentData.flettefelter, dokumentApiNavn),
          },
          types: {
            flettefelt: (props: any) =>
              flettefeltSerializer(props, dokumentData.flettefelter, dokumentApiNavn),
            block: blockSerializer,
            undefined: (_: any) => <div />,
            delmal: (props: any) => delmalSerializer(props, dokumentData.delmalData, maalform),
          },
        }}
      />
    );
  }
}

export default Dokument;
