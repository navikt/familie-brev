import { IDokumentVariabler } from "../../../utils/DokumentVariabler";
import React from "react";
import ListeFelt from "./ListeFelt";

interface ListeFelterProps {
  variabler: IDokumentVariabler;
  settVariabler: Function;
}

function ListeFelter(props: ListeFelterProps) {
  const { variabler, settVariabler } = props;
  const dokumentLister = variabler.lister;

  function endreListeIDokumentVariabler(
    listeNavn: string,
    liste: IDokumentVariabler[]
  ) {
    const nyeVariabler = {
      ...variabler,
      lister: { ...variabler.lister, [listeNavn]: liste },
    };
    settVariabler(nyeVariabler);
  }

  return (
    <div className="meny-element">
      {Object.keys(dokumentLister).map((listeNavn) => (
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
