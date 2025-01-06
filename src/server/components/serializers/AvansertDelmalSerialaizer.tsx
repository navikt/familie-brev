import React, { JSX } from 'react';
import type { IAvansertDokumentVariabler, IDelmaler } from '../../../typer/dokumentApiBrev';
import type { Datasett } from '../../sanity/sanityClient';
import { AvansertDokument } from '../AvansertDokument';
import type { Maalform } from '../../../typer/sanitygrensesnitt';
import { validerAvansertDelmal } from '../../utils/valideringer/validerAvansertDelmal';

interface IAvansertDelmalSerializerProps {
  sanityProps: any;
  delmaler: IDelmaler | undefined;
  maalform: Maalform;
  datasett: Datasett;
  forelderDokumentApiNavn: string;
}

export const AvansertDelmalSerializer = (
  props: IAvansertDelmalSerializerProps,
): JSX.Element | null => {
  const { sanityProps, delmaler, maalform, datasett, forelderDokumentApiNavn } = props;
  const { delmalReferanse, erGjentagende, skalAlltidMed } = sanityProps.value;
  const delmalApiNavn = delmalReferanse.apiNavn;

  validerAvansertDelmal(delmaler, delmalApiNavn, forelderDokumentApiNavn, erGjentagende);

  // Hvis ikke konsument har sendt inn delmalen rendrer vi heller ikke denne delen
  if (!skalAlltidMed && (!delmaler || !delmaler[delmalApiNavn])) {
    return <></>;
  }
  const avanserteDokumentVariabler: IAvansertDokumentVariabler[] | undefined =
    delmaler && delmaler[delmalApiNavn];

  return (
    <div className={'delmal'}>
      {avanserteDokumentVariabler ? (
        avanserteDokumentVariabler.map((variabler, index) => (
          <AvansertDokument
            key={variabler + index.toString()}
            apiNavn={delmalApiNavn}
            avanserteDokumentVariabler={variabler}
            maalform={maalform}
            datasett={datasett}
            dokumentType={delmalReferanse._type}
          />
        ))
      ) : (
        <AvansertDokument
          apiNavn={delmalApiNavn}
          maalform={maalform}
          datasett={datasett}
          dokumentType={delmalReferanse._type}
        />
      )}
    </div>
  );
};
