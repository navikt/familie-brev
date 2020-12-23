import formaterTilCamelCase from '../../sanity/formaterTilCamelCase';
import React from 'react';
import { IDokumentVariabler } from '../../sanity/DokumentVariabler';
import { Maalform } from '../../sanity/hentGrenesnittFraDokument';
import { Datasett } from '../../sanity/sanityClient';
import dokumentlisteSerializer from './dokumentlisteSerializer';
import valgfeltSerializer from './valgfeltSerializer';
import flettefeltSerializer from './flettefeltSerializer';
import submalSerializer from './submalSerialaizer';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const BlockContent = require('@sanity/block-content-to-react');

const listItemSerializer = (
  props: any,
  dokumentVariabler: IDokumentVariabler,
  maalform: Maalform,
  datasett: Datasett,
) => {
  const erSubmal = (markDef: any) => markDef._type === 'submal';
  const submalSkalMed = (mark: any): boolean =>
    !mark.skalMedFelt || !!dokumentVariabler.submaler[formaterTilCamelCase(mark.submal?.id)];

  const erKunText = props.node.markDefs.length === 0;

  const markDefSkalMed = props.node.markDefs?.reduce(
    (acc: boolean, markDef: any) => acc || !erSubmal(markDef) || submalSkalMed(markDef),
    false,
  );

  if (erKunText) {
    return <li>{props.children}</li>;
  } else if (markDefSkalMed) {
    return (
      <BlockContent
        blocks={{ ...props.node, level: undefined, listItem: undefined }}
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
            block: (props: any) => <li className={`block`}>{props.children}</li>,
          },
        }}
      />
    );
  } else {
    return '';
  }
};

export default listItemSerializer;
