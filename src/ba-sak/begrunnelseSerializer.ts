import { Valgfelttype, IBegrunnelsedata } from './typer';
import { Feil } from '../server/utils/Feil';

interface SpanBlock {
  _type: 'span';
  text: string;
}

interface ValgfeltBlock {
  _type: 'valgfelt';
  apiNavn: Valgfelttype;
  valg: ValgMulighet[];
}

interface ValgMulighet {
  delmal: any;
  valgmulighet: string;
}

interface FlettefeltBlock {
  _type: 'flettefelt';
  flettefelt: string;
}

interface BegrunnelseBlock {
  _type: string;
  children: (SpanBlock | ValgfeltBlock | FlettefeltBlock)[];
}

const begrunnelseSerializer = (blocks: BegrunnelseBlock[] = [], data: IBegrunnelsedata) =>
  blocks
    .map(block => {
      if (block._type === 'block' && block.children) {
        return block.children.map(child => formaterSanityBlock(child, data)).join('');
      }
      return '';
    })
    .join('\n\n');

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
      return formaterFormulering(childBlock, data);
    default:
      throw new Feil(
        `Ukjent block fra santity. Det er ikke laget noen funksjonalitet for ${childBlock._type}`,
        400,
      );
  }
};

const formaterFlettefelt = (flettefeltBlock: FlettefeltBlock, data: any) => {
  const flettefeltVerdi = data[flettefeltBlock.flettefelt];

  if (flettefeltVerdi === undefined) {
    throw new Feil(`Flettefeltet "${flettefeltBlock.flettefelt}" mangler for begrunnelse`, 400);
  }

  return flettefeltVerdi;
};

const formaterFormulering = (valgfeltBlock: ValgfeltBlock, data: IBegrunnelsedata) => {
  switch (valgfeltBlock.apiNavn) {
    case Valgfelttype.FOR_BARN_FØDT:
      return data.antallBarn !== 0 ? `for barn født ${data.barnasFodselsdatoer}` : '';
    case Valgfelttype.DU_OG_ELLER_BARNET_BARNA:
      return duOgEllerBarnetBarnaFormulering(data);
    default:
      throw new Feil(
        `Ukjent formulering fra santity. Det er ikke laget noen funksjonalitet for ${valgfeltBlock.apiNavn}`,
        400,
      );
  }
};

const forBarnFodtFormulering = (valgfeltBlock: ValgfeltBlock, data: IBegrunnelsedata): string => {
  if (data.antallBarn === 0) {
    return valgfeltBlock.valg.find(valg => valg.valgmulighet === 'ingenBarn')?.delmal[
      data.maalform
    ];
  }
};

const duOgEllerBarnetBarnaFormulering = (data: IBegrunnelsedata): string => {
  const duOg = data.gjelderSoker && data.antallBarn !== 0 ? 'du og' : data.gjelderSoker ? 'du' : '';
  const barnetBarna = data.antallBarn === 0 ? '' : data.antallBarn === 1 ? ' barnet' : ' barna';
  return duOg + barnetBarna;
};

export default begrunnelseSerializer;
