import { IDokumentVariabler, ISubmal } from "../../../utils/DokumentVariabler";
import { CheckboksPanel } from "nav-frontend-skjema";
import MenyVariabler from "../MenyVariabler";
import React from "react";
import styled from "styled-components";

interface SubmalFeltProps {
  submal: ISubmal;
  navn: string;
  endreSubmalIDokumentVariabler: Function;
}

const StyledSubmalFelt = styled.div`
  label {
    word-break: break-all;
  }
`;

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
      <StyledSubmalFelt>
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
      </StyledSubmalFelt>
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
