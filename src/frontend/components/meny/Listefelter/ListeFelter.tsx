import React from 'react';
import ListeFelt from './ListeFelt';
import { IDokumentVariabler } from '../../../../server/sanity/DokumentVariabler';

interface ListeFelterProps {
  variabler: IDokumentVariabler;
  settVariabler: (dokumentvariabler: IDokumentVariabler) => void;
}

function ListeFelter(props: ListeFelterProps) {
  const { variabler, settVariabler } = props;
  const dokumentLister = variabler.lister;

  function endreListeIDokumentVariabler(listeNavn: string, liste: IDokumentVariabler[]) {
    const nyeVariabler = {
      ...variabler,
      lister: { ...variabler.lister, [listeNavn]: liste },
    };
    settVariabler(nyeVariabler);
  }

  return (
    <div className="meny-element">
      {Object.keys(dokumentLister).map(listeNavn => (
        <ListeFelt
          key={listeNavn}
          liste={dokumentLister[listeNavn]}
          navn={listeNavn}
          endreListeIDokumentVariabler={endreListeIDokumentVariabler}
        />
      ))}
    </div>
  );
}

export default ListeFelter;
