import React from 'react';
import SubmalFelt from './SubmalFelt';
import { IDokumentVariabler, ISubmalMetaData } from '../../../../server/sanity/DokumentVariabler';

interface SubmalFelterProps {
  variabler: IDokumentVariabler;
  settVariabler: Function;
}

function SubmalFelter(props: SubmalFelterProps) {
  const { variabler, settVariabler } = props;
  const { submaler, submalerMetaData } = variabler;

  const endreSubmalIDokumentVariabler = (
    submalNavn: string,
    subfelt: IDokumentVariabler | boolean | undefined,
    submalMetaData: ISubmalMetaData,
  ) => {
    const nyeVariabler = {
      ...variabler,
      submaler: { ...variabler.submaler, [submalNavn]: subfelt },
      submalerMetaData: {
        ...variabler.submalerMetaData,
        [submalNavn]: submalMetaData,
      },
    };
    settVariabler(nyeVariabler);
  };

  return (
    <div className="meny-element">
      {Object.keys(submaler).map(submalNavn => (
        <SubmalFelt
          key={submalNavn}
          submal={submaler[submalNavn]}
          metaData={submalerMetaData ? submalerMetaData[submalNavn] : undefined}
          navn={submalNavn}
          endreSubmalIDokumentVariabler={endreSubmalIDokumentVariabler}
        />
      ))}
    </div>
  );
}

export default SubmalFelter;
