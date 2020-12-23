import formaterTilCamelCase from '../../sanity/formaterTilCamelCase';
import { IDokumentVariabler } from '../../sanity/DokumentVariabler';

const flettefeltSerializer = (props: any, dokumentVariabler: IDokumentVariabler) => {
  const annontering = props.mark.felt.felt;
  if (!dokumentVariabler.flettefelter[formaterTilCamelCase(annontering)]) {
    throw Error(`${annontering} finnes ikke blant dokumentvariablene`);
  }
  return dokumentVariabler.flettefelter[formaterTilCamelCase(annontering)];
};

export default flettefeltSerializer;
