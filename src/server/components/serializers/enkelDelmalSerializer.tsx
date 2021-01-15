import React from 'react';
import { Flettefelter, IEnkelDelmalData } from '../../../typer/dokumentApi';
import flettefeltSerializer from './enkelFlettefeltSerializer';
import blockSerializer from './blockSerializer';
import { Maalform } from '../../../typer/sanitygrensesnitt';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const BlockContent = require('@sanity/block-content-to-react');

const enkelDelmalSerializer = (
  props: any,
  enkelDelmalData: IEnkelDelmalData | undefined,
  maalform: Maalform,
) => {
  // Om delmalen hentes fra en annotering finnes den i props.mark.
  // Om den hentes fra en delmalBlock finnes den i props.node.
  const { enkelDelmalReferanse } = props.mark || props.node;
  const enkelDelmalApiNavn = enkelDelmalReferanse.apiNavn;

  // Hvis ikke konsument har sendt inn delmalen rendrer vi heller ikke denne delen
  if (!enkelDelmalData && !enkelDelmalReferanse.skalAlltidMed) {
    return null;
  }

  const flettefelter: Flettefelter | undefined =
    enkelDelmalData && enkelDelmalData[enkelDelmalApiNavn];

  const erInline = !!props.mark;

  return (
    <div className={`delmal ${erInline ? 'inline' : ''}`}>
      <BlockContent
        blocks={enkelDelmalReferanse[maalform]}
        serializers={{
          marks: {
            flettefelt: (props: any) =>
              flettefeltSerializer(props, flettefelter, enkelDelmalApiNavn),
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
