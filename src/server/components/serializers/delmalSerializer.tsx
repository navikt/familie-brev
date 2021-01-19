import React from 'react';
import { Flettefelter, IDelmalData } from '../../../typer/dokumentApi';
import flettefeltSerializer from './flettefeltSerializer';
import blockSerializer from './blockSerializer';
import { Maalform } from '../../../typer/sanitygrensesnitt';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const BlockContent = require('@sanity/block-content-to-react');

const delmalSerializer = (props: any, delmalData: IDelmalData | undefined, maalform: Maalform) => {
  // Om delmalen hentes fra en annotering finnes den i props.mark.
  // Om den hentes fra en delmalBlock finnes den i props.node.
  console.log(props);
  const { delmalReferanse } = props.mark || props.node;
  const apiNavn = delmalReferanse.apiNavn;

  // Hvis ikke konsument har sendt inn delmalen rendrer vi heller ikke denne delen
  if (!delmalData && !delmalReferanse.skalAlltidMed) {
    return null;
  }

  const flettefelter: Flettefelter | undefined = delmalData && delmalData[apiNavn];

  const erInline = !!props.mark;

  return (
    <div className={`delmal ${erInline ? 'inline' : ''}`}>
      <BlockContent
        blocks={delmalReferanse[maalform]}
        serializers={{
          marks: {
            flettefelt: (props: any) => flettefeltSerializer(props, flettefelter, apiNavn),
          },
          types: {
            block: blockSerializer,
            undefined: (_: any) => <div />,
          },
        }}
      />
    </div>
  );
};

export default delmalSerializer;
