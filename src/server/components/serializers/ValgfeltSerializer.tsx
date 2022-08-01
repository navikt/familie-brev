import React from 'react';
import type { IValg, IValgfelter } from '../../../typer/dokumentApi';
import type { Datasett } from '../../sanity/sanityClient';
import AvansertDokument from '../AvansertDokument';
import type { Maalform } from '../../../typer/sanitygrensesnitt';
import { validerValgfelt } from '../../utils/valideringer/validerValgfelt';
import { Feil } from '../../utils/Feil';

interface IValgfeltSerializer {
  sanityProps: any;
  valgfelter: IValgfelter | undefined;
  maalform: Maalform;
  datasett: Datasett;
  forelderDokumentApiNavn: string;
}

const ValgfeltSerializer = (props: IValgfeltSerializer) => {
  const { sanityProps, valgfelter, maalform, datasett, forelderDokumentApiNavn } = props;
  const { valgReferanse, erGjentagende, skalAlltidMed } = sanityProps.mark || sanityProps.node;
  const { apiNavn, valg: muligeValg } = valgReferanse;

  validerValgfelt(valgfelter, apiNavn, skalAlltidMed, forelderDokumentApiNavn, erGjentagende);

  // Hvis ikke konsument har sendt inn valgfeltet rendrer vi heller ikke denne delen
  if (!valgfelter || !valgfelter[apiNavn]) {
    return '';
  }

  const valg: IValg[] = valgfelter[apiNavn];

  const erInline = !!sanityProps.mark;

  return valg.map(({ navn, dokumentVariabler }) => {
    const riktigDokument = muligeValg.find((valg: any) => valg.valgmulighet === navn);
    const delmalApiNavn = riktigDokument?.delmal?.apiNavn;
    const delmalApiType = riktigDokument?.delmal?._type;

    if (delmalApiNavn) {
      return (
        <div className={`valgfelt ${erInline ? 'inline' : ''}`}>
          <AvansertDokument
            apiNavn={delmalApiNavn}
            avanserteDokumentVariabler={dokumentVariabler}
            maalform={maalform}
            datasett={datasett}
            dokumentType={delmalApiType}
          />
        </div>
      );
    } else {
      throw new Feil(
        `Fant ikke "${navn}" blant valgene til valgfeltet "${apiNavn}" i "${forelderDokumentApiNavn}".` +
          `\nMulige valg er ${muligeValg.map((valg: any) => `\n    - "${valg.valgmulighet}"`)}`,
        404,
      );
    }
  });
};

export default ValgfeltSerializer;
