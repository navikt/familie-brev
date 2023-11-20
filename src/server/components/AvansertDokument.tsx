import React from 'react';
import type { IAvansertDokumentVariabler } from '../../typer/dokumentApiBrev';
import { hentAvansertDokumentQuery } from '../sanity/Queries';
import type { Datasett } from '../sanity/sanityClient';
import { client } from '../sanity/sanityClient';
import useServerEffect from '../utils/useServerEffect';
import ValgfeltSerializer from './serializers/ValgfeltSerializer';
import AvansertDelmalSerializer from './serializers/AvansertDelmalSerialaizer';
import ListItemSerializer from './serializers/ListItemSerializer';
import type { Maalform } from '../../typer/sanitygrensesnitt';
import { DokumentType } from '../../typer/dokumentType';
import FlettefeltSerializer from './serializers/FlettefeltSerializer';
import BlockSerializer from './serializers/BlockSerializer';
import LenkeSerializer from './serializers/LenkeSerializer';
import HtmlfeltSerializer from './serializers/HtmlfeltSerializer';

import { PortableText } from '@portabletext/react';
import { FritekstområdeSerializer } from './serializers/FritekstområdeSerializer';

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
    <PortableText
      value={avansertDokument}
      components={{
        block: BlockSerializer,
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
          htmlfelt: (props: any) =>
            HtmlfeltSerializer({
              sanityProps: props,
              htmlfelter: avanserteDokumentVariabler?.htmlfelter,
              dokumentApiNavn: apiNavn,
            }),
          fritekstområde: (props: any) =>
            FritekstområdeSerializer({
              sanityProps: props,
              fritekstområder: avanserteDokumentVariabler?.fritekstområder,
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
