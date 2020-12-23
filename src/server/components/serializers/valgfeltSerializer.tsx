import formaterTilCamelCase from '../../sanity/formaterTilCamelCase';
import React from 'react';
import { IDokumentVariabler } from '../../sanity/DokumentVariabler';
import { Maalform } from '../../sanity/hentGrenesnittFraDokument';
import { Datasett } from '../../sanity/sanityClient';
import Dokument from '../Dokument';

const valgfeltSerializer = (
  props: any,
  dokumentVariabler: IDokumentVariabler,
  maalform: Maalform,
  datasett: Datasett,
) => {
  const { id: valgFeltId, valg: muligeValg } = props.mark.valgfelt;
  const riktigValg = dokumentVariabler.valgfelter[formaterTilCamelCase(valgFeltId)].valgNavn;
  const riktigDokument = muligeValg.find(
    (valg: any) => formaterTilCamelCase(valg.valgmulighet) === riktigValg,
  );
  const dokumentId = riktigDokument?.delmal?.id;
  const valgVariabler =
    dokumentVariabler.valgfelter[formaterTilCamelCase(valgFeltId)].valgVariabler;
  const variabler = valgVariabler ? valgVariabler : dokumentVariabler;

  if (dokumentId) {
    return (
      <div className={'valgfelt inline'}>
        <Dokument
          dokumentId={dokumentId}
          dokumentVariabler={variabler}
          maalform={maalform}
          datasett={datasett}
        />
      </div>
    );
  } else {
    console.warn(`Fant ikke dokument med tilhørende ${riktigValg}`);
    return '';
  }
};

export default valgfeltSerializer;
