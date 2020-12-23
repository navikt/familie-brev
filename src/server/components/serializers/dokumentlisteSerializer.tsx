import formaterTilCamelCase from '../../sanity/formaterTilCamelCase';
import React from 'react';
import { IDokumentVariabler } from '../../sanity/DokumentVariabler';
import { Maalform } from '../../sanity/hentGrenesnittFraDokument';
import { Datasett } from '../../sanity/sanityClient';
import Dokument from '../Dokument';

const dokumentlisteSerializer = (
  props: any,
  dokumentVariabler: IDokumentVariabler,
  maalform: Maalform,
  datasett: Datasett,
) => {
  const dokumentId = props.node.id;
  const dokumentVariablerListe = dokumentVariabler.lister[formaterTilCamelCase(dokumentId)];

  return (
    <div className={'dokumentListe'}>
      {dokumentVariablerListe.map((dokumentVariabler, index) => (
        <div key={JSON.stringify(`dokumentVariabler${index}`)} className={'dokumentListe'}>
          <Dokument
            dokumentId={dokumentId}
            dokumentVariabler={dokumentVariabler}
            maalform={maalform}
            datasett={datasett}
          />
        </div>
      ))}
    </div>
  );
};

export default dokumentlisteSerializer;
