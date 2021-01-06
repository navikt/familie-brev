import formaterTilCamelCase from '../../sanity/formaterTilCamelCase';
import React from 'react';
import { IDelmal, IDelmaler } from '../../sanity/DokumentVariabler';
import { Maalform } from '../../sanity/hentGrenesnittFraDokument';
import { Datasett } from '../../sanity/sanityClient';
import Dokument from '../Dokument';

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
    <div className={`delmal ${erInline && 'inline'}`}>
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
};

export default delmalSerializer;
