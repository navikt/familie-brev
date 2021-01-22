import React from 'react';
import { IAvansertDokumentVariabler } from '../../typer/dokumentApi';
import { hentAvansertDokumentQuery } from '../sanity/hentAvansertDokumentQuery';
import { client, Datasett } from '../sanity/sanityClient';
import useServerEffect from '../utils/useServerEffect';
import valgfeltSerializer from './serializers/valgfeltSerializer';
import avansertFlettefeltSerializer from './serializers/AvansertFlettefeltSerializer';
import delmalSerializer from './serializers/avansertDelmalSerialaizer';
import listItemSerializer from './serializers/listItemSerializer';
import { Maalform } from '../../typer/sanitygrensesnitt';
import blockSerializer from './serializers/blockSerializer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const BlockContent = require('@sanity/block-content-to-react');

interface AvansertDokumentProps {
  apiNavn: string;
  avansertDokumentVariabler?: IAvansertDokumentVariabler;
  maalform: Maalform;
  erDokumentmal?: boolean;
  datasett: Datasett;
}

function AvansertDokument(avansertDokumentProps: AvansertDokumentProps) {
  const {
    apiNavn,
    avansertDokumentVariabler,
    maalform,
    erDokumentmal = false,
    datasett,
  } = avansertDokumentProps;
  const dokumentType = erDokumentmal ? 'dokumentmal' : 'delmal';

  const [avansertDokument] = useServerEffect(undefined, apiNavn, () => {
    const query = hentAvansertDokumentQuery(dokumentType, apiNavn, maalform);
    return client(datasett)
      .fetch(query)
      .then((res: any) => {
        return res[maalform];
      });
  });

  if (!avansertDokument) {
    return null;
  }

  if (!avansertDokumentVariabler) {
    return (
      <BlockContent
        blocks={avansertDokument}
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
        blocks={avansertDokument}
        serializers={{
          marks: {
            flettefelt: (props: any) =>
              avansertFlettefeltSerializer(props, avansertDokumentVariabler.flettefelter, apiNavn),
            submal: (props: any) =>
              delmalSerializer(props, avansertDokumentVariabler.delmaler, maalform, datasett),
            valgfelt: (props: any) =>
              valgfeltSerializer(props, avansertDokumentVariabler.valgfelter, maalform, datasett),
          },
          types: {
            block: blockSerializer,
            undefined: (_: any) => <div />,
            delmalBlock: (props: any) =>
              delmalSerializer(props, avansertDokumentVariabler.delmaler, maalform, datasett),
            valgfeltBlock: (props: any) =>
              valgfeltSerializer(props, avansertDokumentVariabler.valgfelter, maalform, datasett),
          },
          listItem: (props: any) =>
            listItemSerializer(props, avansertDokumentVariabler, maalform, datasett, apiNavn),
        }}
      />
    );
  }
}

export default AvansertDokument;
