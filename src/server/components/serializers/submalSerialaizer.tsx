import formaterTilCamelCase from '../../sanity/formaterTilCamelCase';
import React from 'react';
import { IDokumentVariabler } from '../../sanity/DokumentVariabler';
import { Maalform } from '../../sanity/hentGrenesnittFraDokument';
import { Datasett } from '../../sanity/sanityClient';
import Dokument from '../Dokument';

const submalSerializer = (
  props: any,
  dokumentVariabler: IDokumentVariabler,
  maalform: Maalform,
  datasett: Datasett,
) => {
  const dokumentId = props.mark.submal.id;

  const submalSkalMed =
    !props.mark.skalMedFelt || !!dokumentVariabler.submaler[formaterTilCamelCase(dokumentId)];

  const submalVariabler = dokumentVariabler.submaler[formaterTilCamelCase(dokumentId)];
  const variabler = typeof submalVariabler === 'object' ? submalVariabler : dokumentVariabler;

  if (submalSkalMed) {
    return (
      <div className={'delmal'}>
        <Dokument
          dokumentId={dokumentId}
          dokumentVariabler={variabler}
          maalform={maalform}
          datasett={datasett}
        />
      </div>
    );
  } else {
    return '';
  }
};

export default submalSerializer;
