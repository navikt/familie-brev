import { IDokumentVariabler, ISubmal } from "./DokumentVariabler";
import {
  IDokument,
  IGrensesnitt,
  ISubmalFelt,
  IValgfelt,
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

  grensesnitt.submalFelter.forEach((submalFelt: ISubmalFelt) => {
    let submal: any = {
      skalMed: true,
      submalVariabler: undefined,
      skalMedBetingelseNavn: undefined,
    };
    if (submalFelt.grensesnitt) {
      submal.submalVariabler = lagPlaceholderVariabler(submalFelt.grensesnitt);
    }
    if (submalFelt.betingelse) {
      submal.skalMedBetingelseNavn = submalFelt.betingelse;
    }
    dokumentvariabler.submaler[submalFelt.submalNavn] = submal as ISubmal;
  });

  grensesnitt.valgfelter.forEach((valgFelt: IValgfelt) => {
    dokumentvariabler.valgfelter[valgFelt.navn] = {
      valgNavn: valgFelt.valgmuigheter[0].valgnavn,
      valgVariabler: lagPlaceholderVariabler(
        valgFelt.valgmuigheter[0].grensesnitt
      ),
    };
  });

  grensesnitt.lister.forEach((dokument: IDokument) => {
    dokumentvariabler.lister[dokument.dokumenttittel] = [
      lagPlaceholderVariabler(dokument.grensesnitt, "-0"),
      lagPlaceholderVariabler(dokument.grensesnitt, "-1"),
    ];
  });

  return dokumentvariabler;
};

export default lagPlaceholderVariabler;
