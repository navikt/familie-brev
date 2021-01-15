import { Flettefelter } from '../../../typer/dokumentApi';

const flettefeltSerializer = (
  props: any,
  flettefelter: Flettefelter | undefined,
  dokumentApiNavn: string,
) => {
  const annontering = props.mark.flettefeltReferanse.felt;
  if (!flettefelter || !flettefelter[annontering]) {
    throw Error(
      `Flettefeltet ${annontering} er påkrevd for dokument med Api-navn "${dokumentApiNavn}"`,
    );
  }
  return flettefelter[annontering];
};

export default flettefeltSerializer;
