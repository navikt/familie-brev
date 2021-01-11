import React from 'react';
import SubmalFelt from './SubmalFelt';
import { IDokumentVariablerMedMetadata } from '../../../../typer/dokumentFrontend';
import { IDelmal } from '../../../../typer/dokumentApi';

interface SubmalFelterProps {
  variabler: IDokumentVariablerMedMetadata;
  settVariabler: (dokumentvariabler: IDokumentVariablerMedMetadata) => void;
}

function SubmalFelter(props: SubmalFelterProps) {
  const { variabler, settVariabler } = props;
  const { delmaler } = variabler;

  const endreSubmalIDokumentVariabler = (delmalnavn: string, delmal: IDelmal) => {
    const nyeVariabler: IDokumentVariablerMedMetadata = {
      ...variabler,
      delmaler: { ...variabler.delmaler, [delmalnavn]: delmal },
    };
    settVariabler(nyeVariabler);
  };

  return (
    <div className="meny-element">
      {Object.keys(delmaler).map(submalNavn => (
        <SubmalFelt
          key={submalNavn}
          delmal={delmaler[submalNavn]}
          navn={submalNavn}
          endreSubmalIDokumentVariabler={endreSubmalIDokumentVariabler}
          delmalGrensesnitt={variabler.delmalMetadata[submalNavn]}
        />
      ))}
    </div>
  );
}

export default SubmalFelter;
