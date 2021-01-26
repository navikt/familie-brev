import React from 'react';
import { IValg, IValgfelter } from '../../../typer/dokumentApi';
import { Datasett } from '../../sanity/sanityClient';
import AvansertDokument from '../AvansertDokument';
import { Maalform } from '../../../typer/sanitygrensesnitt';
import { validerValgfelt } from '../../utils/valideringer';
import { HttpError } from '../../utils/HttpError';

const valgfeltSerializer = (
  props: any,
  valgfelter: IValgfelter | undefined,
  maalform: Maalform,
  datasett: Datasett,
  forelderDokumentApiNavn: string,
) => {
  const { valgReferanse, erGjentagende, skalAlltidMed } = props.mark || props.node;
  const { apiNavn, valg: muligeValg } = valgReferanse;

  validerValgfelt(valgfelter, apiNavn, skalAlltidMed, forelderDokumentApiNavn, erGjentagende);

  // Hvis ikke konsument har sendt inn valgfeltet rendrer vi heller ikke denne delen
  if (!valgfelter || !valgfelter[apiNavn]) {
    return '';
  }

  const valg: IValg[] = valgfelter[apiNavn];

  const erInline = !!props.mark;

  return valg.map(({ navn, dokumentVariabler }) => {
    const riktigDokument = muligeValg.find((valg: any) => valg.valgmulighet === navn);
    const delmalApiNavn = riktigDokument?.delmal?.apiNavn;

    if (delmalApiNavn) {
      return (
        <div className={`valgfelt ${erInline ? 'inline' : ''}`}>
          <AvansertDokument
            apiNavn={delmalApiNavn}
            avanserteDokumentVariabler={dokumentVariabler}
            maalform={maalform}
            datasett={datasett}
            dokumentType={riktigDokument._type}
          />
        </div>
      );
    } else {
      throw new HttpError(
        `Fant ikke "${navn}" blant valgene til valgfeltet "${apiNavn}" i "${forelderDokumentApiNavn}".` +
          `\nMulige valg er ${muligeValg.map((valg: any) => `\n    - "${valg.valgmulighet}"`)}`,
        404,
      );
    }
  });
};

export default valgfeltSerializer;
