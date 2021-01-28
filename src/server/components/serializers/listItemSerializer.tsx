import React from 'react';
import { IAvansertDokumentVariabler } from '../../../typer/dokumentApi';
import { Datasett } from '../../sanity/sanityClient';
import valgfeltSerializer from './valgfeltSerializer';
import { Maalform } from '../../../typer/sanitygrensesnitt';
import avansertDelmalSerializer from './avansertDelmalSerialaizer';
import flettefeltSerializer from './flettefeltSerializer';
import lenkeSerializer from './lenkeSerializer';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const BlockContent = require('@sanity/block-content-to-react');

const listItemSerializer = (
  props: any,
  dokumentVariabler: IAvansertDokumentVariabler | undefined,
  maalform: Maalform,
  datasett: Datasett,
  apiNavn: string,
) => {
  const erDelmal = (markDef: any) => markDef._type === 'delmal';
  const delmalSkalMed = (mark: any): boolean =>
    !mark.skalMedFelt || !!dokumentVariabler?.delmaler[mark.submal?.id];

  const erKunText = props.node.markDefs.length === 0;

  const markDefSkalMed = props.node.markDefs?.reduce(
    (acc: boolean, markDef: any) => acc || !erDelmal(markDef) || delmalSkalMed(markDef),
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
            flettefelt: (props: any) =>
              flettefeltSerializer(props, dokumentVariabler?.flettefelter, apiNavn),
            lenke: lenkeSerializer,
            delmal: (props: any) =>
              avansertDelmalSerializer(
                props,
                dokumentVariabler?.delmaler,
                maalform,
                datasett,
                apiNavn,
              ),
            valgfelt: (props: any) =>
              valgfeltSerializer(props, dokumentVariabler?.valgfelter, maalform, datasett, apiNavn),
          },
          types: {
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
