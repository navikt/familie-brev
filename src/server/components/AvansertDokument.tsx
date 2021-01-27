import React from 'react';
import { IAvansertDokumentVariabler } from '../../typer/dokumentApi';
import { hentAvansertDokumentQuery } from '../sanity/Queries';
import { client, Datasett } from '../sanity/sanityClient';
import useServerEffect from '../utils/useServerEffect';
import valgfeltSerializer from './serializers/valgfeltSerializer';
import avansertDelmalSerializer from './serializers/avansertDelmalSerialaizer';
import listItemSerializer from './serializers/listItemSerializer';
import { Maalform } from '../../typer/sanitygrensesnitt';
import blockSerializer from './serializers/blockSerializer';
import flettefeltSerializer from './serializers/flettefeltSerializer';
import { DokumentType } from '../../typer/dokumentType';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const BlockContent = require('@sanity/block-content-to-react');

interface AvansertDokumentProps {
  apiNavn: string;
  avanserteDokumentVariabler?: IAvansertDokumentVariabler;
  maalform: Maalform;
  erDokumentmal?: boolean;
  datasett: Datasett;
  dokumentType: DokumentType;
}

function AvansertDokument(avansertDokumentProps: AvansertDokumentProps) {
  const {
    apiNavn,
    avanserteDokumentVariabler,
    maalform,
    datasett,
    dokumentType = DokumentType.DOKUMENTMAL,
  } = avansertDokumentProps;

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

  return (
    <BlockContent
      blocks={avansertDokument}
      serializers={{
        marks: {
          flettefelt: (props: any) =>
            flettefeltSerializer(props, avanserteDokumentVariabler?.flettefelter, apiNavn),
          delmal: (props: any) =>
            avansertDelmalSerializer(
              props,
              avanserteDokumentVariabler?.delmaler,
              maalform,
              datasett,
              apiNavn,
            ),
          valgfelt: (props: any) =>
            valgfeltSerializer(
              props,
              avanserteDokumentVariabler?.valgfelter,
              maalform,
              datasett,
              apiNavn,
            ),
        },
        types: {
          block: blockSerializer,
          undefined: (_: any) => <div />,
          delmalBlock: (props: any) =>
            avansertDelmalSerializer(
              props,
              avanserteDokumentVariabler?.delmaler,
              maalform,
              datasett,
              apiNavn,
            ),
          valgBlock: (props: any) =>
            valgfeltSerializer(
              props,
              avanserteDokumentVariabler?.valgfelter,
              maalform,
              datasett,
              apiNavn,
            ),
        },
        listItem: (props: any) =>
          listItemSerializer(props, avanserteDokumentVariabler, maalform, datasett, apiNavn),
      }}
    />
  );
}

export default AvansertDokument;
