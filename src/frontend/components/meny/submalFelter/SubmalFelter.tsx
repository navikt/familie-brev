import { IDokumentVariabler, ISubmal } from "../../../utils/DokumentVariabler";
import React from "react";
import SubmalFelt from "./SubmalFelt";

interface SubmalFelterProps {
  variabler: IDokumentVariabler;
  settVariabler: Function;
}

function SubmalFelter(props: SubmalFelterProps) {
  const { variabler, settVariabler } = props;
  const { submaler } = variabler;

  const endreSubmalIDokumentVariabler = (
    submalNavn: string,
    subfelt: ISubmal
  ) => {
    const nyeVariabler = {
      ...variabler,
      submaler: { ...variabler.submaler, [submalNavn]: subfelt },
    };
    settVariabler(nyeVariabler);
  };

  return (
    <div className="meny-element">
      {Object.keys(submaler).map((submalNavn) => (
        <SubmalFelt
          key={submalNavn}
          submal={submaler[submalNavn]}
          navn={submalNavn}
          endreSubmalIDokumentVariabler={endreSubmalIDokumentVariabler}
        />
      ))}
    </div>
  );
}

export default SubmalFelter;
