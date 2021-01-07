import React from 'react';
import { IDokumentVariabler } from '../sanity/DokumentVariabler';
import hentDokumentQuery from '../sanity/hentDokumentQuery';
import { Maalform } from '../sanity/hentGrenesnittFraDokument';
import { client, Datasett } from '../sanity/sanityClient';
import useServerEffect from '../dokument/useServerEffect';
import valgfeltSerializer from './serializers/valgfeltSerializer';
import flettefeltSerializer from './serializers/flettefeltSerializer';
import delmalSerializer from './serializers/delmalSerialaizer';
import listItemSerializer from './serializers/listItemSerializer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const BlockContent = require('@sanity/block-content-to-react');

interface DokumentProps {
  dokumentId: string;
  dokumentVariabler?: IDokumentVariabler;
  maalform: Maalform;
  erDokumentmal?: boolean;
  datasett: Datasett;
}

function Dokument(dokumentProps: DokumentProps) {
  const {
    dokumentId,
    dokumentVariabler,
    maalform,
    erDokumentmal = false,
    datasett,
  } = dokumentProps;
  const dokumentType = erDokumentmal ? 'dokumentmal' : 'delmal';

  const [dokument] = useServerEffect(undefined, dokumentId, () => {
    const query = hentDokumentQuery(dokumentType, dokumentId, maalform);
    return client(datasett)
      .fetch(query)
      .then((res: any) => {
        return res[maalform];
      });
  });

  if (!dokument) {
    return null;
  }

  if (!dokumentVariabler) {
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
            flettefelt: (props: any) => flettefeltSerializer(props, dokumentVariabler),
            submal: (props: any) =>
              delmalSerializer(props, dokumentVariabler.delmaler, maalform, datasett),
            valgfelt: (props: any) =>
              valgfeltSerializer(props, dokumentVariabler.valgfelter, maalform, datasett),
          },
          types: {
            block: (props: any) => (
              <div style={{ minHeight: '1rem' }} className={`block`}>
                {props.children}
              </div>
            ),
            undefined: (_: any) => <div />,
            delmalBlock: (props: any) =>
              delmalSerializer(props, dokumentVariabler.delmaler, maalform, datasett),
          },
          listItem: (props: any) =>
            listItemSerializer(props, dokumentVariabler, maalform, datasett),
        }}
      />
    );
  }
}

export default Dokument;
