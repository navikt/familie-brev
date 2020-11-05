import { IDokumentVariabler } from "../../utils/DokumentVariabler";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Input } from "nav-frontend-skjema";
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
        <Flettefelt key={flettefelt}>
          <span>{flettefelt}: </span>
          <Input
            type="text"
            value={flettefelter[flettefelt]}
            alt={flettefelter.fletteFelt}
            placeholder={flettefelter.fletteFelt}
            onChange={(e) => hmm(e, flettefelt)}
          />
        </Flettefelt>
      ))}
    </div>
  );
}

const Flettefelt = styled.div`
  margin-top: 10px;
`;
