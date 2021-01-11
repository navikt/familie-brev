import { CheckboksPanel } from 'nav-frontend-skjema';
import MenyVariabler from '../MenyVariabler';
import React, { useState } from 'react';
import { IDelmal } from '../../../../typer/dokumentApi';
import { camelCaseTilVanligTekst } from '../../../utils/camelCaseTilVanligTekst';
import { ISanityDelmalGrensesnitt } from '../../../../typer/sanitygrensesnitt';
import { IDokumentVariablerMedMetadata } from '../../../../typer/dokumentFrontend';
import lagPlaceholderVariabler from '../../../utils/lagPlaceholderVariabler';

interface DelmalFeltProps {
  delmal: IDelmal;
  navn: string;
  endreSubmalIDokumentVariabler: (delmalnavn: string, delmal: IDelmal) => void;
  delmalGrensesnitt: ISanityDelmalGrensesnitt;
}

function SubmalFelt(props: DelmalFeltProps) {
  const [skalVises, settSkalVises] = useState<boolean>(true);

  const { navn, delmal, endreSubmalIDokumentVariabler, delmalGrensesnitt } = props;

  const endreSkalVises = () => {
    settSkalVises(!skalVises);

    if (skalVises) {
      const nyeVariabler: IDokumentVariablerMedMetadata = lagPlaceholderVariabler(
        delmalGrensesnitt.grensesnitt,
      );
      endreSubmalVariabler(nyeVariabler, 0);
    } else {
      endreSubmalIDokumentVariabler(navn, {
        erGjentagende: delmal.erGjentagende,
        dokumentVariabler: [],
      });
    }
  };

  const endreSubmalVariabler = (delmalvariabler: IDokumentVariablerMedMetadata, index: number) => {
    const nyeVariabler = delmal.dokumentVariabler;
    nyeVariabler[index] = delmalvariabler;

    const nyDelmal: IDelmal = {
      erGjentagende: delmal.erGjentagende,
      dokumentVariabler: nyeVariabler,
    };
    endreSubmalIDokumentVariabler(navn, nyDelmal);
  };

  return (
    <>
      {delmal.dokumentVariabler.map((dokumentvariabel, index) => (
        <>
          {delmalGrensesnitt.betingelse && (
            <CheckboksPanel
              onChange={endreSkalVises}
              checked={skalVises}
              label={camelCaseTilVanligTekst(delmalGrensesnitt.betingelse)}
            />
          )}
          {skalVises && (
            <MenyVariabler
              settVariabler={dokumentvariabler => endreSubmalVariabler(dokumentvariabler, index)}
              variabler={dokumentvariabel as IDokumentVariablerMedMetadata}
            />
          )}
        </>
      ))}
    </>
  );
}

export default SubmalFelt;
