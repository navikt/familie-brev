import React from 'react';
import type { Flettefelter, IDelmalData } from '../../../typer/dokumentApi';
import FlettefeltSerializer from './FlettefeltSerializer';
import BlockSerializer from './BlockSerializer';
import type { Maalform } from '../../../typer/sanitygrensesnitt';
import LenkeSerializer from './LenkeSerializer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const BlockContent = require('@sanity/block-content-to-react');

interface IDelmalSerializerProps {
  sanityProps: any;
  delmalData: IDelmalData | undefined;
  maalform: Maalform;
}

const DelmalSerializer = (props: IDelmalSerializerProps) => {
  const { sanityProps, delmalData, maalform } = props;
  // Om delmalen hentes fra en annotering finnes den i sanityProps.mark.
  // Om den hentes fra en delmalBlock finnes den i sanityProps.node.
  const { delmalReferanse, skalAlltidMed } = sanityProps.mark || sanityProps.node;
  const apiNavn = delmalReferanse.apiNavn;

  // Hvis ikke konsument har sendt inn delmalen rendrer vi heller ikke denne delen
  if (!skalAlltidMed && (!delmalData || !delmalData[apiNavn])) {
    return null;
  }

  const flettefelter: Flettefelter | undefined = delmalData && delmalData[apiNavn];

  const erInline = !!sanityProps.mark;

  return (
    <div className={`delmal ${erInline ? 'inline' : ''}`}>
      <BlockContent
        blocks={delmalReferanse[maalform]}
        serializers={{
          marks: {
            flettefelt: (props: any) =>
              FlettefeltSerializer({ sanityProps: props, flettefelter, dokumentApiNavn: apiNavn }),
            lenke: LenkeSerializer,
          },
          types: {
            block: BlockSerializer,
            undefined: (_: any) => <div />,
          },
        }}
      />
    </div>
  );
};

export default DelmalSerializer;
