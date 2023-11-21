import type {
  BegrunnelseBlock,
  BegrunnelseMedData,
  FlettefeltBlock,
  SpanBlock,
  ValgfeltBlock,
  ValgfeltV2Block,
} from './typer';
import { Feil } from '../server/utils/Feil';
import { formaterFlettefelt, formaterValgfelt } from './formateringer';
import { lagStorForbokstav } from '../server/utils/strenghåndtering';

const begrunnelseSerializer = (
  blocks: BegrunnelseBlock[] | Record<string, never>,
  data: BegrunnelseMedData,
): string => {
  if (!Array.isArray(blocks)) {
    throw new Feil(`Fant ikke begrunnelse med apiNavn=${data.apiNavn}`, 404);
  }
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
  block: SpanBlock | ValgfeltBlock | FlettefeltBlock | ValgfeltV2Block | any,
  data: BegrunnelseMedData,
): string => {
  switch (block._type) {
    case 'span':
      return block.text;
    case 'flettefelt':
      return formaterFlettefelt(block, data);
    case 'eosFlettefelt':
      return formaterFlettefelt(block, data);
    case 'valgfelt':
      return formaterValgfelt(block, data);
    case 'valgfeltV2':
      const tekst = formaterValgfelt(block.valgReferanse, data);
      const førsteBokstavSkalVæreStor = block.skalHaStorForbokstav;
      return førsteBokstavSkalVæreStor ? lagStorForbokstav(tekst) : tekst;
    default:
      throw new Feil(
        `Ukjent block fra santity. Det er ikke laget noen funksjonalitet for ${block._type}`,
        400,
      );
  }
};

export default begrunnelseSerializer;
