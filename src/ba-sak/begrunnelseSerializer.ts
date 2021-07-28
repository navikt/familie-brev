import { Formuleringstype, IBegrunnelsedata } from './typer';
import { Feil } from '../server/utils/Feil';

interface SpanBlock {
  _type: 'span';
  text: string;
}

interface FormuleringBlock {
  _type: 'formulering';
  formulering: Formuleringstype;
}

interface FlettefeltBlock {
  _type: 'flettefelt';
  flettefelt: string;
}

interface BegrunnelseBlock {
  _type: string;
  children: (SpanBlock | FormuleringBlock | FlettefeltBlock)[];
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
  childBlock: SpanBlock | FormuleringBlock | FlettefeltBlock | any,
  data: IBegrunnelsedata,
): string => {
  switch (childBlock._type) {
    case 'span':
      return childBlock.text;
    case 'flettefelt':
      return formaterFlettefelt(childBlock, data);
    case 'formulering':
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

const formaterFormulering = (formuleringBlock: FormuleringBlock, data: IBegrunnelsedata) => {
  switch (formuleringBlock.formulering) {
    case Formuleringstype.FOR_BARN_FØDT:
      return data.antallBarn !== 0 ? `for barn født ${data.barnasFodselsdatoer}` : '';
    case Formuleringstype.DU_OG_ELLER_BARNET_BARNA:
      return duOgEllerBarnetBarnaFormulering(data);
    default:
      throw new Feil(
        `Ukjent formulering fra santity. Det er ikke laget noen funksjonalitet for ${formuleringBlock.formulering}`,
        400,
      );
  }
};

const duOgEllerBarnetBarnaFormulering = (data: IBegrunnelsedata): string => {
  const duOg = data.gjelderSoker && data.antallBarn !== 0 ? 'du og' : data.gjelderSoker ? 'du' : '';
  const barnetBarna = data.antallBarn === 0 ? '' : data.antallBarn === 1 ? ' barnet' : ' barna';
  return duOg + barnetBarna;
};

export default begrunnelseSerializer;
