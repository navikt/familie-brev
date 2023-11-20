import React from 'react';
import type { IValg, IValgfelter } from '../../../typer/dokumentApiBrev';
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

const ValgfeltSerializer = (props: IValgfeltSerializer): JSX.Element => {
  const { sanityProps, valgfelter, maalform, datasett, forelderDokumentApiNavn } = props;
  const { valgReferanse, erGjentagende, skalAlltidMed } = sanityProps.value;
  const { apiNavn, valg: muligeValg } = valgReferanse;

  validerValgfelt(valgfelter, apiNavn, skalAlltidMed, forelderDokumentApiNavn, erGjentagende);

  // Hvis ikke konsument har sendt inn valgfeltet rendrer vi heller ikke denne delen
  if (!valgfelter || !valgfelter[apiNavn]) {
    return <></>;
  }

  const valg: IValg[] = valgfelter[apiNavn];

  return (
    <>
      {valg.map(({ navn, dokumentVariabler }, index) => {
        const riktigDokument = muligeValg.find((valg: any) => valg.valgmulighet === navn);
        const delmalApiNavn = riktigDokument?.delmal?.apiNavn;
        const delmalApiType = riktigDokument?.delmal?._type;

        if (delmalApiNavn) {
          return (
            <div key={index} className={'valgfelt'}>
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
      })}
    </>
  );
};

export default ValgfeltSerializer;
