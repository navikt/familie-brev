import { IDokumentVariabler, ISubmal } from "./DokumentVariabler";
import {
  IDokument,
  IGrensesnitt,
  ISubmalGrensesnitt,
  IValgfeltGrensesnitt,
} from "./hentGrenesnittFraDokument";

const lagPlaceholder = (variabel: string, tillegg: string): string =>
  `${variabel}-eksempel${tillegg}`;

const lagPlaceholderVariabler = (
  grensesnitt: IGrensesnitt,
  placeholderTillegg: string = ""
): IDokumentVariabler => {
  let dokumentvariabler: IDokumentVariabler = {
    submaler: {},
    flettefelter: {},
    valgfelter: {},
    lister: {},
  };
  grensesnitt.flettefelter.forEach((flettefelt: string) => {
    dokumentvariabler.flettefelter[flettefelt] = lagPlaceholder(
      flettefelt,
      placeholderTillegg
    );
  });

  grensesnitt.submalFelter.forEach((submalFelt: ISubmalGrensesnitt) => {
    let submal: any = {
      skalMed: true,
      submalVariabler: undefined,
      skalMedBetingelseNavn: undefined,
    };
    if (submalFelt.grensesnitt) {
      submal.submalVariabler = lagPlaceholderVariabler(
        submalFelt.grensesnitt,
        placeholderTillegg
      );
    }
    if (submalFelt.betingelse) {
      submal.skalMedBetingelseNavn = submalFelt.betingelse;
    }
    dokumentvariabler.submaler[submalFelt.submalNavn] = submal as ISubmal;
  });

  grensesnitt.valgfelter.forEach((valgFelt: IValgfeltGrensesnitt) => {
    const { valgmuigheter, navn } = valgFelt;
    dokumentvariabler.valgfelter[navn] = {
      valgNavn: valgmuigheter[0].valgnavn,
      valgVariabler: lagPlaceholderVariabler(
        valgmuigheter[0].grensesnitt,
        placeholderTillegg
      ),
      muligeValg: valgmuigheter.map((valgMulighet) => ({
        valgNavn: valgMulighet.valgnavn,
        valgVariabler: lagPlaceholderVariabler(
          valgMulighet.grensesnitt,
          placeholderTillegg
        ),
        muligeValg: undefined,
      })),
    };
  });

  grensesnitt.lister.forEach((dokument: IDokument) => {
    dokumentvariabler.lister[dokument.dokumenttittel] = [
      lagPlaceholderVariabler(dokument.grensesnitt, `${placeholderTillegg}-1`),
      lagPlaceholderVariabler(dokument.grensesnitt, `${placeholderTillegg}-2`),
    ];
  });

  return dokumentvariabler;
};

export default lagPlaceholderVariabler;
