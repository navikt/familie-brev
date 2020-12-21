import React from 'react';
import ValgFelt from './ValgFelt';
import { IDokumentVariabler, IValg } from '../../../../server/sanity/DokumentVariabler';

interface SubmalFelterProps {
  variabler: IDokumentVariabler;
  settVariabler: Function;
}

function ValgFelter(props: SubmalFelterProps) {
  const { variabler, settVariabler } = props;
  const { valgfelter } = variabler;

  const endreValgfeltIDokumentVariabler = (valgfeltNavn: string, valgfelt: IValg) => {
    const nyeVariabler = {
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
        />
      ))}
    </div>
  );
}

export default ValgFelter;
