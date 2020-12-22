import React from 'react';
import SubmalFelt from './SubmalFelt';
import { IDokumentVariabler } from '../../../../server/sanity/DokumentVariabler';

interface SubmalFelterProps {
  variabler: IDokumentVariabler;
  settVariabler: (dokumentvariabler: IDokumentVariabler) => void;
}

function SubmalFelter(props: SubmalFelterProps) {
  const { variabler, settVariabler } = props;
  const { submaler, submalerBetingelser } = variabler;

  const endreSubmalIDokumentVariabler = (
    submalNavn: string,
    subfelt: IDokumentVariabler | boolean | undefined,
  ) => {
    const nyeVariabler = {
      ...variabler,
      submaler: { ...variabler.submaler, [submalNavn]: subfelt },
    };
    settVariabler(nyeVariabler);
  };

  return (
    <div className="meny-element">
      {Object.keys(submaler).map(submalNavn => (
        <SubmalFelt
          key={submalNavn}
          submal={submaler[submalNavn]}
          betingelse={submalerBetingelser ? submalerBetingelser[submalNavn] : undefined}
          navn={submalNavn}
          endreSubmalIDokumentVariabler={endreSubmalIDokumentVariabler}
        />
      ))}
    </div>
  );
}

export default SubmalFelter;
