import formaterTilCamelCase from '../../sanity/formaterTilCamelCase';
import React from 'react';
import { Flettefelter, IEnkleDelmalData } from '../../../typer/dokumentApi';
import flettefeltSerializer from './flettefeltSerializer';
import blockSerializer from './blockSerializer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const BlockContent = require('@sanity/block-content-to-react');

const enkelDelmalSerializer = (props: any, enkleDelmalData: IEnkleDelmalData) => {
  const { submal } = props.mark || props.node;
  const enkeltDelmalId = formaterTilCamelCase(submal.id);

  const flettefelter: Flettefelter | undefined = enkleDelmalData[enkeltDelmalId];
  // Hvis ikke konsument har sendt inn delmalen rendrer vi heller ikke denne delen
  if (!flettefelter) {
    return '';
  }

  const erInline = !!props.mark;

  return (
    <div className={`delmal ${erInline ? 'inline' : ''}`}>
      <BlockContent
        blocks={props.node}
        serializers={{
          marks: {
            flettefelt: (props: any) => flettefeltSerializer(props, flettefelter),
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
