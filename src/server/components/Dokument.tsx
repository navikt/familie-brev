import React from 'react';
import { IDokumentVariabler } from '../sanity/DokumentVariabler';
import hentDokumentQuery from '../sanity/hentDokumentQuery';
import { Maalform } from '../sanity/hentGrenesnittFraDokument';
import { client, Datasett } from '../sanity/sanityClient';
import useServerEffect from '../dokument/useServerEffect';
import valgfeltSerializer from './serializers/valgfeltSerializer';
import dokumentlisteSerializer from './serializers/dokumentlisteSerializer';
import flettefeltSerializer from './serializers/flettefeltSerializer';
import submalSerializer from './serializers/submalSerialaizer';
import listItemSerializer from './serializers/listItemSerializer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const BlockContent = require('@sanity/block-content-to-react');

interface DokumentProps {
  dokumentId: string;
  dokumentVariabler: IDokumentVariabler;
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

  return (
    <BlockContent
      blocks={dokument}
      serializers={{
        marks: {
          flettefelt: (props: any) => flettefeltSerializer(props, dokumentVariabler),
          submal: (props: any) => submalSerializer(props, dokumentVariabler, maalform, datasett),
          valgfelt: (props: any) =>
            valgfeltSerializer(props, dokumentVariabler, maalform, datasett),
        },
        types: {
          dokumentliste: (props: any) =>
            dokumentlisteSerializer(props, dokumentVariabler, maalform, datasett),
          block: (props: any) => <div className={`block`}>{props.children}</div>,
        },
        listItem: (props: any) => listItemSerializer(props, dokumentVariabler, maalform, datasett),
      }}
    />
  );
}

export default Dokument;
