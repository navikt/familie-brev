import formaterTilCamelCase from '../../sanity/formaterTilCamelCase';
import React from 'react';
import { IDelmal, IDelmaler } from '../../../typer/dokumentApi';
import { Datasett } from '../../sanity/sanityClient';
import AvansertDokument from '../AvansertDokument';
import { Maalform } from '../../../typer/sanitygrensesnitt';

const delmalSerializer = (
  props: any,
  delmaler: IDelmaler,
  maalform: Maalform,
  datasett: Datasett,
) => {
  const { submal } = props.mark || props.node;
  const dokumentId = formaterTilCamelCase(submal.id);

  const delmal: IDelmal | undefined = delmaler[dokumentId];
  // Hvis ikke konsument har sendt inn delmalen rendrer vi heller ikke denne delen
  if (!delmal) {
    return '';
  }

  const { dokumentVariabler } = delmaler[dokumentId];

  const erInline = !!props.mark;

  return (
    <div className={`delmal ${erInline ? 'inline' : ''}`}>
      {dokumentVariabler.length > 0 ? (
        dokumentVariabler.map((variabler, index) => (
          <AvansertDokument
            key={variabler + index.toString()}
            dokumentId={submal.id}
            dokumentVariabler={variabler}
            maalform={maalform}
            datasett={datasett}
          />
        ))
      ) : (
        <AvansertDokument
          dokumentId={submal.id}
          dokumentVariabler={undefined}
          maalform={maalform}
          datasett={datasett}
        />
      )}
    </div>
  );
};

export default delmalSerializer;
