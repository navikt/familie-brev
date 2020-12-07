import { CheckboksPanel } from "nav-frontend-skjema";
import MenyVariabler from "../MenyVariabler";
import React from "react";
import {
  IDokumentVariabler,
  ISubmal,
} from "../../../../server/sanity/DokumentVariabler";

interface SubmalFeltProps {
  submal: ISubmal;
  navn: string;
  endreSubmalIDokumentVariabler: Function;
}

function SubmalFelt(props: SubmalFeltProps) {
  const { navn, submal, endreSubmalIDokumentVariabler } = props;

  const toggleSubmal = () => {
    endreSubmalIDokumentVariabler(navn, {
      ...submal,
      skalMed: !submal.skalMed,
    });
  };

  const endreSubmalVariabler = (subfeltVariabler: IDokumentVariabler) => {
    const nySubmal = { ...submal, submalVariabler: subfeltVariabler };
    endreSubmalIDokumentVariabler(navn, nySubmal);
  };

  if (submal.skalMedBetingelseNavn) {
    return (
      <>
        <CheckboksPanel
          onChange={toggleSubmal}
          checked={submal.skalMed}
          label={submal.skalMedBetingelseNavn}
        />
        {submal.skalMed && submal.submalVariabler && (
          <MenyVariabler
            settVariabler={endreSubmalVariabler}
            variabler={submal.submalVariabler}
          />
        )}
      </>
    );
  }

  return (
    <>
      {submal.submalVariabler && (
        <MenyVariabler
          settVariabler={endreSubmalVariabler}
          variabler={submal.submalVariabler}
        />
      )}
    </>
  );
}

export default SubmalFelt;
