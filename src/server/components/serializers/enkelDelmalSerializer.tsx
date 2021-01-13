import formaterTilCamelCase from '../../sanity/formaterTilCamelCase';
import React from 'react';
import { Flettefelter, IEnkelDelmalData } from '../../../typer/dokumentApi';
import flettefeltSerializer from './flettefeltSerializer';
import blockSerializer from './blockSerializer';
import { Maalform } from '../../../typer/sanitygrensesnitt';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const BlockContent = require('@sanity/block-content-to-react');

const enkelDelmalSerializer = (
  props: any,
  enkelDelmalData: IEnkelDelmalData | undefined,
  maalform: Maalform,
) => {
  const { submal } = props.mark || props.node;
  const enkeltDelmalId = formaterTilCamelCase(submal.id);

  // Hvis ikke konsument har sendt inn delmalen rendrer vi heller ikke denne delen
  if (!enkelDelmalData && submal.skalMedFelt) {
    return '';
  }

  const flettefelter: Flettefelter | undefined = enkelDelmalData && enkelDelmalData[enkeltDelmalId];

  const erInline = !!props.mark;

  return (
    <div className={`delmal ${erInline ? 'inline' : ''}`}>
      <BlockContent
        blocks={submal[maalform]}
        serializers={{
          marks: {
            flettefelt: (props: any) => flettefeltSerializer(props, flettefelter, submal.id),
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

export default enkelDelmalSerializer;
