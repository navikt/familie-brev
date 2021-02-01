import React from 'react';
import { IAvansertDokumentVariabler, IDelmaler } from '../../../typer/dokumentApi';
import { Datasett } from '../../sanity/sanityClient';
import AvansertDokument from '../AvansertDokument';
import { Maalform } from '../../../typer/sanitygrensesnitt';
import validerAvansertDelmal from '../../utils/valideringer/validerAvansertDelmal';

interface IAvansertDelmalSerializerProps {
  sanityProps: any;
  delmaler: IDelmaler | undefined;
  maalform: Maalform;
  datasett: Datasett;
  forelderDokumentApiNavn: string;
}

const AvansertDelmalSerializer = (props: IAvansertDelmalSerializerProps) => {
  const { sanityProps, delmaler, maalform, datasett, forelderDokumentApiNavn } = props;
  const { delmalReferanse, erGjentagende, skalAlltidMed } = sanityProps.mark || sanityProps.node;
  const delmalApiNavn = delmalReferanse.apiNavn;

  validerAvansertDelmal(delmaler, delmalApiNavn, forelderDokumentApiNavn, erGjentagende);

  // Hvis ikke konsument har sendt inn delmalen rendrer vi heller ikke denne delen
  if (!skalAlltidMed && (!delmaler || !delmaler[delmalApiNavn])) {
    return '';
  }
  const avanserteDokumentVariabler: IAvansertDokumentVariabler[] | undefined =
    delmaler && delmaler[delmalApiNavn];

  const erInline = !!sanityProps.mark;

  return (
    <div className={`delmal ${erInline ? 'inline' : ''}`}>
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

export default AvansertDelmalSerializer;
