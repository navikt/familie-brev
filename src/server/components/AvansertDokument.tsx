import React from 'react';
import { IAvansertDokumentVariabler } from '../../typer/dokumentApi';
import { hentAvansertDokumentQuery } from '../sanity/Queries';
import { client, Datasett } from '../sanity/sanityClient';
import useServerEffect from '../utils/useServerEffect';
import ValgfeltSerializer from './serializers/ValgfeltSerializer';
import AvansertDelmalSerializer from './serializers/AvansertDelmalSerialaizer';
import ListItemSerializer from './serializers/ListItemSerializer';
import { Maalform } from '../../typer/sanitygrensesnitt';
import { DokumentType } from '../../typer/dokumentType';
import FlettefeltSerializer from './serializers/FlettefeltSerializer';
import BlockSerializer from './serializers/BlockSerializer';
import LenkeSerializer from './serializers/LenkeSerializer';

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
            FlettefeltSerializer({
              sanityProps: props,
              flettefelter: avanserteDokumentVariabler?.flettefelter,
              dokumentApiNavn: apiNavn,
            }),
          lenke: LenkeSerializer,
          delmal: (props: any) =>
            AvansertDelmalSerializer({
              sanityProps: props,
              delmaler: avanserteDokumentVariabler?.delmaler,
              maalform,
              datasett,
              forelderDokumentApiNavn: apiNavn,
            }),
          valgfelt: (props: any) =>
            ValgfeltSerializer({
              sanityProps: props,
              valgfelter: avanserteDokumentVariabler?.valgfelter,
              maalform,
              datasett,
              forelderDokumentApiNavn: apiNavn,
            }),
        },
        types: {
          block: BlockSerializer,
          undefined: (_: any) => <div />,
          delmalBlock: (props: any) =>
            AvansertDelmalSerializer({
              sanityProps: props,
              delmaler: avanserteDokumentVariabler?.delmaler,
              maalform,
              datasett,
              forelderDokumentApiNavn: apiNavn,
            }),
          valgBlock: (props: any) =>
            ValgfeltSerializer({
              sanityProps: props,
              valgfelter: avanserteDokumentVariabler?.valgfelter,
              maalform,
              datasett,
              forelderDokumentApiNavn: apiNavn,
            }),
        },
        listItem: (props: any) =>
          ListItemSerializer({
            sanityProps: props,
            avanserteDokumentVariabler,
            maalform,
            datasett,
            apiNavn,
          }),
      }}
    />
  );
}

export default AvansertDokument;
