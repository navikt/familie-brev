import { IDokumentVariabler } from "../../utils/DokumentVariabler";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Input } from "nav-frontend-skjema";
import { Element} from "nav-frontend-typografi";
import styled from "styled-components";

export default function (props: {
  variabler: IDokumentVariabler;
  settVariabler: Function;
}) {
  const { variabler, settVariabler } = props;

  return (
    <div>
      <Flettefelter variabler={variabler} settVariabler={settVariabler} />
    </div>
  );
}

function Flettefelter(props: {
  variabler: IDokumentVariabler;
  settVariabler: Function;
}) {
  const { variabler, settVariabler } = props;
  const { flettefelter } = variabler;

  function endreFlettefeltIDokumentVariabler(
    flettefelt: string,
    verdi: string
  ): IDokumentVariabler {
    return {
      ...variabler,
      flettefelter: { ...variabler.flettefelter, [flettefelt]: verdi },
    };
  }
  const hmm = (e: ChangeEvent<HTMLInputElement>, flettefelt: string) => {
    const nyeVariabler = endreFlettefeltIDokumentVariabler(
      flettefelt,
      e.target.value
    );
    settVariabler(nyeVariabler);
  };

  return (
    <div>
      {Object.keys(flettefelter).map((flettefelt) => (
        <StyledFlettefelt key={flettefelt}>
          <Element className="label">{flettefelt}</Element>
          <Input
            type="text"
            value={flettefelter[flettefelt]}
            alt={flettefelter.fletteFelt}
            placeholder={flettefelter.fletteFelt}
            onChange={(e) => hmm(e, flettefelt)}
          />
        </StyledFlettefelt>
      ))}
    </div>
  );
}

const StyledFlettefelt = styled.div`
  margin-top: 20px;

  .label {
    text-transform: capitalize;
    margin-bottom: 0.5rem;
  }
`;
