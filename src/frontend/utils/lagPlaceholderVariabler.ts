import {
  IDokument,
  IGrensesnitt,
  ISubmalGrensesnitt,
  IValgfeltGrensesnitt,
} from '../../server/sanity/hentGrenesnittFraDokument';
import { IDokumentVariabler } from '../../server/sanity/DokumentVariabler';

const lagPlaceholder = (variabel: string, tillegg: string): string =>
  `${variabel}-eksempel${tillegg}`;

const lagPlaceholderVariabler = (
  grensesnitt: IGrensesnitt,
  placeholderTillegg = '',
): IDokumentVariabler => {
  const dokumentvariabler: IDokumentVariabler = {
    submalerBetingelser: {},
    delmaler: {},
    flettefelter: {},
    valgfelter: {},
    lister: {},
  };

  grensesnitt.flettefelter.forEach((flettefelt: string) => {
    dokumentvariabler.flettefelter[flettefelt] = lagPlaceholder(flettefelt, placeholderTillegg);
  });

  grensesnitt.submalFelter.forEach((submalFelt: ISubmalGrensesnitt) => {
    if (submalFelt.grensesnitt) {
      dokumentvariabler.delmaler[submalFelt.submalId] = lagPlaceholderVariabler(
        submalFelt.grensesnitt,
        placeholderTillegg,
      );
      if (dokumentvariabler.submalerBetingelser) {
        dokumentvariabler.submalerBetingelser[`${submalFelt.submalId}`] = submalFelt.betingelse;
      }
    } else {
      if (submalFelt.betingelse != null) {
        dokumentvariabler.delmaler[submalFelt.submalId] = true;
      }
    }
  });

  grensesnitt.valgfelter.forEach((valgFelt: IValgfeltGrensesnitt) => {
    const { valgmuigheter, navn } = valgFelt;
    dokumentvariabler.valgfelter[navn] = {
      valgNavn: valgmuigheter[0].valgnavn,
      valgVariabler:
        valgmuigheter[0].grensesnitt &&
        lagPlaceholderVariabler(valgmuigheter[0].grensesnitt, placeholderTillegg),
      muligeValg: valgmuigheter.map(valgMulighet => ({
        valgNavn: valgMulighet.valgnavn,
        valgVariabler:
          valgMulighet.grensesnitt &&
          lagPlaceholderVariabler(valgMulighet.grensesnitt, placeholderTillegg),
        muligeValg: undefined,
      })),
    };
  });

  grensesnitt.lister.forEach((dokument: IDokument) => {
    dokumentvariabler.lister[dokument.id] = [
      lagPlaceholderVariabler(dokument.grensesnitt, `${placeholderTillegg}-1`),
      lagPlaceholderVariabler(dokument.grensesnitt, `${placeholderTillegg}-2`),
    ];
  });

  return dokumentvariabler;
};

export default lagPlaceholderVariabler;
