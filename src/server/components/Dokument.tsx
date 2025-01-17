import React from 'react';
import type { IDokumentData } from '../../typer/dokumentApiBrev';
import { hentDokumentQuery } from '../sanity/Queries';
import type { Datasett } from '../sanity/sanityClient';
import { client } from '../sanity/sanityClient';
import { useServerEffect } from '../utils/useServerEffect';
import type { Maalform } from '../../typer/sanitygrensesnitt';
import { BlockSerializer } from './serializers/BlockSerializer';
import { FlettefeltSerializer } from './serializers/FlettefeltSerializer';
import { PeriodeSerializer } from './serializers/PeriodeSerializer';
import { DelmalSerializer } from './serializers/DelmalSerializer';
import { DokumentType } from '../../typer/dokumentType';
import { Feil } from '../utils/Feil';
import { LenkeSerializer } from './serializers/LenkeSerializer';

import { PortableText } from '@portabletext/react';
import { SammensattKontrollsakSerializer } from './serializers/SammensattKontrollsakSerializer';
import { FritekstSerializer } from './serializers/FritekstSerializer';

interface DokumentProps {
  dokumentApiNavn: string;
  dokumentData: IDokumentData | undefined;
  maalform: Maalform;
  datasett: Datasett;
}

export const Dokument = (dokumentProps: DokumentProps) => {
  const { dokumentApiNavn, dokumentData, maalform, datasett } = dokumentProps;

  const [dokument] = useServerEffect(undefined, dokumentApiNavn, () => {
    const query = hentDokumentQuery(DokumentType.DOKUMENT, dokumentApiNavn, maalform);
    return client(datasett)
      .fetch(query)
      .then((res: any) => {
        if (!res[maalform]) {
          throw new Feil(
            `Fant ikke ${maalform} tekst for "${dokumentApiNavn}" i datasettet "${datasett}".`,
            404,
          );
        }
        return res[maalform];
      });
  });

  if (!dokument) {
    return null;
  }

  return (
    <PortableText
      value={dokument}
      components={{
        block: BlockSerializer,
        marks: {
          flettefelt: (props: any) =>
            FlettefeltSerializer({
              sanityProps: props,
              flettefelter: dokumentData?.flettefelter,
              dokumentApiNavn,
            }),
          lenke: LenkeSerializer,
          hoyrestill: (props: any) => <span className={'høyrestill'}>{props.children}</span>,
        },
        types: {
          flettefelt: (props: any) =>
            FlettefeltSerializer({
              sanityProps: props,
              flettefelter: dokumentData?.flettefelter,
              dokumentApiNavn,
            }),
          sammensattKontrollsakFritekst: (_: any) =>
            SammensattKontrollsakSerializer({
              dokumentData: dokumentData,
            }),
          fritekst: (_: any) =>
            FritekstSerializer({
              dokumentData: dokumentData,
            }),
          perioder: (props: any) =>
            PeriodeSerializer({
              sanityProps: props,
              dokumentData: dokumentData,
              maalform,
              datasett,
              forelderApiNavn: dokumentApiNavn,
            }),
          undefined: (_: any) => <div />,
          delmal: (props: any) =>
            DelmalSerializer({
              sanityProps: props,
              dokumentData: dokumentData,
              maalform,
            }),
        },
      }}
    />
  );
};
