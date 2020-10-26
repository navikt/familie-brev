import { IDokumentGrensesnitt } from "./Grensesnitt";

export const Testgrensesnitt: {
  [dokumentnavn: string]: IDokumentGrensesnitt;
} = {
  Innvilget: {
    flettefelter: {
      fodselsnummer: "12345678910",
      navn: "Mor Moresen",
      dokumentDato: "02.02.1970",
      enhet: "baks",
      saksbehandler: "Dronning Sonja",
      beslutter: "Kong Håkon",
      hjemler: "§§ 999 og 1000",
      etterbetalingsbelop: "1099",
    },
    skalMedFelter: {
      erEtterbetaling: true,
    },
    lister: {
      Periode: [
        {
          flettefelter: {
            fom: "02.02.02",
            tom: "03.03.03",
            belop: "1100",
            antallBarn: "1",
            barnasFodselsdatoer: "31.02.2019",
          },
          skalMedFelter: {
            INNVILGET_BOSATT_I_RIKTET: true,
            INNVILGET_LOVLIG_OPPHOLD_OPPHOLDSTILLATELSE: true,
          },
          lister: {},
        },
        {
          flettefelter: {
            fom: "02.02.03",
            tom: "03.03.04",
            belop: "2200",
            antallBarn: "2",
            barnasFodselsdatoer: "31.02.2019 og 31.02.2020",
          },
          skalMedFelter: {
            INNVILGET_BOSATT_I_RIKTET: true,
          },
          lister: {},
        },
      ],
    },
  },
};
