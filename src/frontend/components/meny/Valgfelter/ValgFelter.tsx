import React from 'react';
import ValgFelt from './ValgFelt';
import { IDokumentVariablerMedMetadata } from '../../../../typer/dokumentFrontend';
import { IValgfelt } from '../../../../typer/dokumentApi';

interface ValgFelterProps {
  variabler: IDokumentVariablerMedMetadata;
  settVariabler: (dokumentvariabler: IDokumentVariablerMedMetadata) => void;
}

function ValgFelter(props: ValgFelterProps) {
  const { variabler, settVariabler } = props;
  const { valgfelter, valgfeltMetadata } = variabler;

  const endreValgfeltIDokumentVariabler = (valgfeltNavn: string, valgfelt: IValgfelt) => {
    const nyeVariabler: IDokumentVariablerMedMetadata = {
      ...variabler,
      valgfelter: { ...variabler.valgfelter, [valgfeltNavn]: valgfelt },
    };
    settVariabler(nyeVariabler);
  };

  return (
    <div className="meny-element">
      {Object.keys(valgfelter).map(valgfelt => (
        <ValgFelt
          key={valgfelt}
          valgfelt={valgfelter[valgfelt]}
          navn={valgfelt}
          endreValgfeltIDokumentVariabler={endreValgfeltIDokumentVariabler}
          valgfeltgrensesnitt={valgfeltMetadata[valgfelt]}
        />
      ))}
    </div>
  );
}

export default ValgFelter;
