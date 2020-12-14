import {
  IDokument,
  IGrensesnitt,
  ISubmalGrensesnitt,
  IValgfeltGrensesnitt,
} from "../../server/sanity/hentGrenesnittFraDokument";
import {
  IDokumentVariabler,
  ISubmal,
} from "../../server/sanity/DokumentVariabler";

const lagPlaceholder = (variabel: string, tillegg: string): string =>
  `${variabel}-eksempel${tillegg}`;

const lagPlaceholderVariabler = (
  grensesnitt: IGrensesnitt,
  placeholderTillegg: string = ""
): IDokumentVariabler => {
  let dokumentvariabler: IDokumentVariabler;
  dokumentvariabler = {
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
    dokumentvariabler.submaler[submalFelt.submalId] = submal as ISubmal;
  });

  grensesnitt.valgfelter.forEach((valgFelt: IValgfeltGrensesnitt) => {
    const { valgmuigheter, navn } = valgFelt;
    dokumentvariabler.valgfelter[navn] = {
      valgNavn: valgmuigheter[0].valgnavn,
      valgVariabler:
        valgmuigheter[0].grensesnitt &&
        lagPlaceholderVariabler(
          valgmuigheter[0].grensesnitt,
          placeholderTillegg
        ),
      muligeValg: valgmuigheter.map((valgMulighet) => ({
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
