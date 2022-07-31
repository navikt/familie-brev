import { IBrevMedSignatur, IDokumentDataMedPeriode } from '../../../typer/dokumentApi';

export const opphorMedEndringDokumentData: IDokumentDataMedPeriode = {
  flettefelter: {
    navn: ['Navn Navnesen'],
    fodselsnummer: ['12345678910'],
    dato: ['2. mars 2021'],
  },
  perioder: [
    {
      fom: ['1. april 2021'],
      tom: ['til og med 1. mai '],
      belop: ['1056'],
      antallBarn: ['1'],
      barnasFodselsdager: ['08.04.2020'],
      begrunnelser: [],
      type: ['innvilgelse'],
    },
    {
      fom: ['1. august 2021'],
      tom: ['til og med 1. mai '],
      belop: ['0'],
      antallBarn: ['1'],
      barnasFodselsdager: ['08.04.2020'],
      begrunnelser: ['Fritekst 1', 'Fritekst 2', 'Fritekst 3'],
      type: ['opphor'],
    },
  ],
  delmalData: {
    hjemmeltekst: {
      hjemler: ['§§ 1, 2 og 3'],
    },
    etterbetaling: {
      etterbetalingsbelop: ['1 054'],
    },
    signaturVedtak: {
      enhet: ['NAV Familie- og pensjonsytelser Oslo'],
      saksbehandler: ['saksbehandler'],
      beslutter: ['beslutter'],
    },
  },
};

export const demobrevInnvilgetDokumentData: IBrevMedSignatur = {
  saksbehandlersignatur: 'Test saksbehandler',
  besluttersignatur: 'Test beslutter',
  brevFraSaksbehandler: {
    flettefelter: {
      navn: ['Halvor'],
      fodselsnummer: ['12345678901'],
    },
    delmaler: {
      sluttStoenad: [
        {
          flettefelter: {
            tilOgMedDato: ['1. januar'],
          },
          delmaler: {},
          valgfelter: {},
          htmlfelter: {},
        },
      ],
      inntektUnderHalvG: [
        {
          valgfelter: {
            medEllerUtenGOmregning: [
              {
                navn: 'ingenGOmregning',
                dokumentVariabler: {
                  flettefelter: {
                    belop: ['333'],
                  },
                  delmaler: {},
                  valgfelter: {},
                  htmlfelter: {},
                },
              },
            ],
          },
          delmaler: {},
          flettefelter: {},
          htmlfelter: {},
        },
      ],
    },
    valgfelter: {},
    htmlfelter: {},
  },
};
