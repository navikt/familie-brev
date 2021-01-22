import formaterTilCamelCase from '../../sanity/formaterTilCamelCase';
import React from 'react';
import { IAvansertDokumentVariabler } from '../../../typer/dokumentApi';
import { Datasett } from '../../sanity/sanityClient';
import valgfeltSerializer from './valgfeltSerializer';
import avansertFlettefeltSerializer from './AvansertFlettefeltSerializer';
import delmalSerializer from './avansertDelmalSerialaizer';
import { Maalform } from '../../../typer/sanitygrensesnitt';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const BlockContent = require('@sanity/block-content-to-react');

const listItemSerializer = (
  props: any,
  dokumentVariabler: IAvansertDokumentVariabler,
  maalform: Maalform,
  datasett: Datasett,
  dokumentId: string,
) => {
  const erSubmal = (markDef: any) => markDef._type === 'submal';
  const submalSkalMed = (mark: any): boolean =>
    !mark.skalMedFelt || !!dokumentVariabler.delmaler[formaterTilCamelCase(mark.submal?.id)];

  const erKunText = props.node.markDefs.length === 0;

  const markDefSkalMed = props.node.markDefs?.reduce(
    (acc: boolean, markDef: any) => acc || !erSubmal(markDef) || submalSkalMed(markDef),
    false,
  );

  if (erKunText) {
    return <li>{props.children}</li>;
  } else if (markDefSkalMed) {
    if (!dokumentVariabler) {
      return (
        <BlockContent
          blocks={{ ...props.node, level: undefined, listItem: undefined }}
          serializers={{
            types: {
              block: (props: any) => <li className={`block`}>{props.children}</li>,
            },
          }}
        />
      );
    } else {
      return (
        <BlockContent
          blocks={{ ...props.node, level: undefined, listItem: undefined }}
          serializers={{
            marks: {
              flettefelt: (props: any) =>
                avansertFlettefeltSerializer(props, dokumentVariabler.flettefelter, dokumentId),
              submal: (props: any) =>
                delmalSerializer(props, dokumentVariabler.delmaler, maalform, datasett),
              valgfelt: (props: any) =>
                valgfeltSerializer(props, dokumentVariabler.valgfelter, maalform, datasett),
            },
            types: {
              block: (props: any) => <li className={`block`}>{props.children}</li>,
            },
          }}
        />
      );
    }
  } else {
    return '';
  }
};

export default listItemSerializer;
