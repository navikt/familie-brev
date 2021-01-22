import { IAvansertDokumentVariabler, IValg } from '../../typer/dokumentApi';
import {
  ISanityDelmalGrensesnitt,
  ISanityGrensesnitt,
  ISanityValgfeltGrensesnitt,
  ISanityValgmulighet,
} from '../../typer/sanitygrensesnitt';
import { IDokumentVariablerMedMetadata } from '../../typer/dokumentFrontend';

/* TODO: fikse flettefelst liste
const lagPlaceholder = (variabel: string, tillegg: string): string =>
  `${variabel}-eksempel${tillegg}`;
*/

const lagPlaceholderVariabler = (
  grensesnitt: ISanityGrensesnitt,
  placeholderTillegg = '',
): IDokumentVariablerMedMetadata => {
  const dokumentVariabler: IDokumentVariablerMedMetadata = {
    delmaler: {},
    flettefelter: {},
    valgfelter: {},
    valgfeltMetadata: {},
    delmalMetadata: {},
  };

  /* TODO: fikse flettefelst liste
  grensesnitt.flettefelter.forEach((flettefelt: string) => {
    dokumentVariabler.flettefelter[flettefelt] = lagPlaceholder(flettefelt, placeholderTillegg);
  });*/

  grensesnitt.delmaler.forEach((delmal: ISanityDelmalGrensesnitt) => {
    let delmalDokumentVariabler: IAvansertDokumentVariabler[] = [];

    if (delmal.erGjentagende) {
      delmalDokumentVariabler = [
        lagPlaceholderVariabler(delmal.grensesnitt, placeholderTillegg + '-1'),
        lagPlaceholderVariabler(delmal.grensesnitt, placeholderTillegg + '-2'),
      ];
    } else {
      delmalDokumentVariabler = [lagPlaceholderVariabler(delmal.grensesnitt, placeholderTillegg)];
    }

    dokumentVariabler.delmaler[delmal.id] = {
      erGjentagende: delmal.erGjentagende,
      dokumentVariabler: delmalDokumentVariabler,
    };

    dokumentVariabler.delmalMetadata[delmal.id] = delmal;
  });

  const lagValg = (valgmulighetIndex: number, valgmuligheter: ISanityValgmulighet[]) => ({
    navn: valgmuligheter[valgmulighetIndex].valgnavn,
    dokumentVariabler: lagPlaceholderVariabler(
      valgmuligheter[valgmulighetIndex].grensesnitt,
      placeholderTillegg,
    ),
  });

  grensesnitt.valgfelter.forEach((valgFelt: ISanityValgfeltGrensesnitt) => {
    const { valgmuligheter, navn, erGjentagende } = valgFelt;

    let valg: IValg[] = [];

    if (erGjentagende) {
      valg = [lagValg(0, valgmuligheter), lagValg(1, valgmuligheter)];
    } else {
      valg = [lagValg(0, valgmuligheter)];
    }

    dokumentVariabler.valgfelter[navn] = {
      valg: valg,
      erGjentagende: erGjentagende,
    };

    dokumentVariabler.valgfeltMetadata[navn] = valgFelt;
  });

  return dokumentVariabler;
};

export default lagPlaceholderVariabler;
