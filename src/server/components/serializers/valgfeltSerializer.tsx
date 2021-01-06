import formaterTilCamelCase from '../../sanity/formaterTilCamelCase';
import React from 'react';
import { IValgfelt, IValgfelter } from '../../sanity/DokumentVariabler';
import { Maalform } from '../../sanity/hentGrenesnittFraDokument';
import { Datasett } from '../../sanity/sanityClient';
import Dokument from '../Dokument';

const valgfeltSerializer = (
  props: any,
  valgfelter: IValgfelter,
  maalform: Maalform,
  datasett: Datasett,
) => {
  const { id, valg: muligeValg } = props.mark.valgfelt;
  const valgFeltId = formaterTilCamelCase(id);

  const valgfelt: IValgfelt | undefined = valgfelter[valgFeltId];
  // Hvis ikke konsument har sendt inn valgfeltet rendrer vi heller ikke denne delen
  if (!valgfelt) {
    return '';
  }

  const { valgNavn, erGjentagende, dokumentVariabler } = valgfelter[valgFeltId];

  const riktigDokument = muligeValg.find(
    (valg: any) => formaterTilCamelCase(valg.valgmulighet) === valgNavn,
  );

  if (erGjentagende && dokumentVariabler.length === 0) {
    throw new Error(`Gjentagende valgfelt ${valgFeltId} skal ha minst en dokumentVariabler`);
  }

  const dokumentId = riktigDokument?.delmal?.id;
  if (dokumentId) {
    return (
      <div className={'valgfelt inline'}>
        {dokumentVariabler.length > 0 ? (
          dokumentVariabler.map(variabler => (
            <Dokument
              dokumentId={dokumentId}
              dokumentVariabler={variabler}
              maalform={maalform}
              datasett={datasett}
            />
          ))
        ) : (
          <Dokument
            dokumentId={dokumentId}
            dokumentVariabler={undefined}
            maalform={maalform}
            datasett={datasett}
          />
        )}
        )
      </div>
    );
  } else {
    throw new Error(`Gjentagende valgfelt ${valgFeltId} skal ha minst en dokumentVariabler`);
  }
};

export default valgfeltSerializer;
