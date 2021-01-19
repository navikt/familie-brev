import formaterTilCamelCase from '../../sanity/formaterTilCamelCase';
import React from 'react';
import { IValgfelt, IValgfelter } from '../../../typer/dokumentApi';
import { Datasett } from '../../sanity/sanityClient';
import AvansertDokument from '../AvansertDokument';
import { Maalform } from '../../../typer/sanitygrensesnitt';

const valgfeltSerializer = (
  props: any,
  valgfelter: IValgfelter,
  maalform: Maalform,
  datasett: Datasett,
) => {
  const { valgfelt: santyValgfelt } = props.mark || props.node;
  const { id, valg: muligeValg } = santyValgfelt;
  const valgFeltId = formaterTilCamelCase(id);

  const valgfelt: IValgfelt | undefined = valgfelter[valgFeltId];
  // Hvis ikke konsument har sendt inn valgfeltet rendrer vi heller ikke denne delen
  if (!valgfelt) {
    return '';
  }

  const { valg, erGjentagende } = valgfelter[valgFeltId];

  if (erGjentagende && valg.length === 0) {
    throw new Error(`Gjentagende valgfelt ${valgFeltId} skal ha minst en dokumentVariabler`);
  }

  const erInline = !!props.mark;

  return valg.map(({ navn, dokumentVariabler }) => {
    const riktigDokument = muligeValg.find(
      (valg: any) => formaterTilCamelCase(valg.valgmulighet) === navn,
    );
    const dokumentId = riktigDokument?.delmal?.id;

    if (dokumentId) {
      return (
        <div className={`valgfelt ${erInline ? 'inline' : ''}`}>
          <AvansertDokument
            dokumentId={dokumentId}
            dokumentVariabler={dokumentVariabler}
            maalform={maalform}
            datasett={datasett}
          />
        </div>
      );
    } else {
      throw new Error(`Gjentagende valgfelt ${valgFeltId} skal ha minst en dokumentVariabler`);
    }
  });
};

export default valgfeltSerializer;
