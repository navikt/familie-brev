import React from 'react';
import type { IAvansertDokumentVariabler } from '../../typer/dokumentApiBrev.js';
import { hentAvansertDokumentQuery } from '../sanity/Queries.js';
import type { Datasett } from '../sanity/sanityClient.js';
import { client } from '../sanity/sanityClient.js';
import { useServerEffect } from '../utils/useServerEffect.js';
import { ValgfeltSerializer } from './serializers/ValgfeltSerializer.js';
import { AvansertDelmalSerializer } from './serializers/AvansertDelmalSerialaizer.js';
import { ListItemSerializer } from './serializers/ListItemSerializer.js';
import type { Maalform } from '../../typer/sanitygrensesnitt.js';
import { DokumentType } from '../../typer/dokumentType.js';
import { FlettefeltSerializer } from './serializers/FlettefeltSerializer.js';
import { BlockSerializer } from './serializers/BlockSerializer.js';
import { LenkeSerializer } from './serializers/LenkeSerializer.js';
import { HtmlfeltSerializer } from './serializers/HtmlfeltSerializer.js';

import { PortableText } from '@portabletext/react';
import { FritekstområdeSerializer } from './serializers/FritekstområdeSerializer.js';

interface AvansertDokumentProps {
  apiNavn: string;
  avanserteDokumentVariabler?: IAvansertDokumentVariabler;
  maalform: Maalform;
  erDokumentmal?: boolean;
  datasett: Datasett;
  dokumentType: DokumentType;
}

export const AvansertDokument = (avansertDokumentProps: AvansertDokumentProps) => {
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

  if (avanserteDokumentVariabler?.overstyrtDelmalblokk?.skalOverstyre) {
    // TODO: Håndtere htmlTabell her
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: avanserteDokumentVariabler.overstyrtDelmalblokk.htmlInnhold,
        }}
      />
    );
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
};
