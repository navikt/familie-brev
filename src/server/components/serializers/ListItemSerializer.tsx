import React from 'react';
import { IAvansertDokumentVariabler } from '../../../typer/dokumentApi';
import { Datasett } from '../../sanity/sanityClient';
import ValgfeltSerializer from './ValgfeltSerializer';
import { Maalform } from '../../../typer/sanitygrensesnitt';
import AvansertDelmalSerializer from './AvansertDelmalSerialaizer';
import FlettefeltSerializer from './FlettefeltSerializer';
import { DokumentType } from '../../../typer/dokumentType';
import { PortableText } from '@portabletext/react';

interface IListItemSerializerProps {
  sanityProps: any;
  avanserteDokumentVariabler: IAvansertDokumentVariabler | undefined;
  maalform: Maalform;
  datasett: Datasett;
  apiNavn: string;
}

const ListItemSerializer = (props: IListItemSerializerProps): JSX.Element | null => {
  const { sanityProps, avanserteDokumentVariabler, maalform, datasett, apiNavn } = props;
  const erDelmal = (markDef: any) => markDef._type === DokumentType.DELMAL;
  const delmalSkalMed = (mark: any): boolean =>
    !mark.skalMedFelt || !!avanserteDokumentVariabler?.delmaler[mark.submal?.id];

  const erKunText = sanityProps.value.markDefs.length === 0;

  const markDefSkalMed = sanityProps.value.markDefs?.reduce(
    (acc: boolean, markDef: any) => acc || !erDelmal(markDef) || delmalSkalMed(markDef),
    false,
  );

  if (erKunText) {
    return <li>{sanityProps.children}</li>;
  } else if (markDefSkalMed) {
    return (
      <PortableText
        value={{ ...sanityProps.value, level: undefined, listItem: undefined }}
        components={{
          marks: {
            flettefelt: (props: any) =>
              FlettefeltSerializer({
                sanityProps: props,
                flettefelter: avanserteDokumentVariabler?.flettefelter,
                dokumentApiNavn: apiNavn,
              }),
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
            block: (props: any) => <li className={`block`}>{props.children}</li>,
          },
        }}
      />
    );
  } else {
    return null;
  }
};

export default ListItemSerializer;
