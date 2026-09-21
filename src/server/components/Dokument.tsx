import React from 'react';
import type { IDokumentData } from '../../typer/dokumentApiBrev.js';
import { hentDokumentQuery } from '../sanity/Queries.js';
import type { Datasett } from '../sanity/sanityClient.js';
import { client } from '../sanity/sanityClient.js';
import { useServerEffect } from '../utils/useServerEffect.js';
import type { Maalform } from '../../typer/sanitygrensesnitt.js';
import { BlockSerializer } from './serializers/BlockSerializer.js';
import { FlettefeltSerializer } from './serializers/FlettefeltSerializer.js';
import { PeriodeSerializer } from './serializers/PeriodeSerializer.js';
import { DelmalSerializer } from './serializers/DelmalSerializer.js';
import { DokumentType } from '../../typer/dokumentType.js';
import { Feil } from '../utils/Feil.js';
import { LenkeSerializer } from './serializers/LenkeSerializer.js';

import { PortableText } from '@portabletext/react';
import { SammensattKontrollsakSerializer } from './serializers/SammensattKontrollsakSerializer.js';
import { FritekstSerializer } from './serializers/FritekstSerializer.js';

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
