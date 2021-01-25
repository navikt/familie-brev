import React from 'react';
import { IAvansertDokumentVariabler, IDelmaler } from '../../../typer/dokumentApi';
import { Datasett } from '../../sanity/sanityClient';
import AvansertDokument from '../AvansertDokument';
import { Maalform } from '../../../typer/sanitygrensesnitt';
import { validerDelmal } from '../../utils/valideringer';

const AvansertDelmalSerializer = (
  props: any,
  delmaler: IDelmaler | undefined,
  maalform: Maalform,
  datasett: Datasett,
  forelderDokumentApiNavn: string,
) => {
  const { delmalReferanse, erGjentagende, skalAlltidMed } = props.mark || props.node;
  const delmalApiNavn = delmalReferanse.apiNavn;

  validerDelmal(delmaler, delmalApiNavn, forelderDokumentApiNavn, erGjentagende);

  // Hvis ikke konsument har sendt inn delmalen rendrer vi heller ikke denne delen
  if (!skalAlltidMed && (!delmaler || !delmaler[delmalApiNavn])) {
    return '';
  }
  const avanserteDokumentVariabler: IAvansertDokumentVariabler[] | undefined =
    delmaler && delmaler[delmalApiNavn];

  const erInline = !!props.mark;

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
