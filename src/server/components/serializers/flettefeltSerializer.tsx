import formaterTilCamelCase from '../../sanity/formaterTilCamelCase';
import { Flettefelter } from '../../../typer/dokumentApi';

const flettefeltSerializer = (props: any, flettefelter: Flettefelter) => {
  const annontering = props.mark.felt.felt;
  if (!flettefelter[formaterTilCamelCase(annontering)]) {
    throw Error(`${annontering} finnes ikke blant dokumentvariablene`);
  }
  return flettefelter[formaterTilCamelCase(annontering)];
};

export default flettefeltSerializer;
