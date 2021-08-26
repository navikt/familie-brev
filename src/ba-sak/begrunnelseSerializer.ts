import {
  IBegrunnelsedata,
  BegrunnelseBlock,
  ValgfeltBlock,
  FlettefeltBlock,
  SpanBlock,
} from './typer';
import { Feil } from '../server/utils/Feil';
import { formaterFlettefelt, formaterValgfelt } from './formateringer';

const begrunnelseSerializer = (blocks: BegrunnelseBlock[] = [], data: IBegrunnelsedata) => {
  return blocks
    .map(block => {
      if (block._type === 'block' && block.children) {
        return block.children.map(child => formaterSanityBlock(child, data)).join('');
      }
      return '';
    })
    .join('\n\n');
};

const formaterSanityBlock = (
  childBlock: SpanBlock | ValgfeltBlock | FlettefeltBlock | any,
  data: IBegrunnelsedata,
): string => {
  switch (childBlock._type) {
    case 'span':
      return childBlock.text;
    case 'flettefelt':
      return formaterFlettefelt(childBlock, data);
    case 'valgfelt':
      return formaterValgfelt(childBlock, data);
    default:
      throw new Feil(
        `Ukjent block fra santity. Det er ikke laget noen funksjonalitet for ${childBlock._type}`,
        400,
      );
  }
};

export default begrunnelseSerializer;
