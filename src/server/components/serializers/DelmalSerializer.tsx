import React from 'react';
import type { Flettefelter, IDelmalData } from '../../../typer/dokumentApi';
import FlettefeltSerializer from './FlettefeltSerializer';
import BlockSerializer from './BlockSerializer';
import type { Maalform } from '../../../typer/sanitygrensesnitt';
import LenkeSerializer from './LenkeSerializer';
import { PortableText } from '@portabletext/react';

interface IDelmalSerializerProps {
  sanityProps: any;
  delmalData: IDelmalData | undefined;
  maalform: Maalform;
}

const DelmalSerializer = (props: IDelmalSerializerProps) => {
  const { sanityProps, delmalData, maalform } = props;
  const { delmalReferanse, skalAlltidMed } = sanityProps.value;
  const apiNavn = delmalReferanse.apiNavn;

  // Hvis ikke konsument har sendt inn delmalen rendrer vi heller ikke denne delen
  if (!skalAlltidMed && (!delmalData || !delmalData[apiNavn])) {
    return null;
  }

  const flettefelter: Flettefelter | undefined = delmalData && delmalData[apiNavn];

  return (
    <div className={'delmal'}>
      <PortableText
        value={delmalReferanse[maalform]}
        components={{
          block: BlockSerializer,
          marks: {
            flettefelt: (props: any) =>
              FlettefeltSerializer({
                sanityProps: props,
                flettefelter,
                dokumentApiNavn: apiNavn,
              }),
            lenke: LenkeSerializer,
          },
          types: {
            undefined: (_: any) => <div />,
          },
        }}
      />
    </div>
  );
};

export default DelmalSerializer;
