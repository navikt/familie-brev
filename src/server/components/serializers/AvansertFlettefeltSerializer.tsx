import formaterTilCamelCase from '../../sanity/formaterTilCamelCase';
import { Flettefelter } from '../../../typer/dokumentApi';

const avansertFlettefeltSerializer = (
  props: any,
  flettefelter: Flettefelter | undefined,
  dokumentId: string,
) => {
  const annontering = props.mark.felt.felt;
  if (!flettefelter || !flettefelter[formaterTilCamelCase(annontering)]) {
    throw Error(`Flettefeltet ${annontering} er påkrevd for dokument med Id "${dokumentId}"`);
  }
  return flettefelter[formaterTilCamelCase(annontering)];
};

export default avansertFlettefeltSerializer;
