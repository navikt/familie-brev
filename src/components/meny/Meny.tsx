import React, { Dispatch, SetStateAction, useState } from "react";
import styled from "styled-components";
import { RadioGruppe, Radio } from "nav-frontend-skjema";
import { Select } from "nav-frontend-skjema";
import { Input } from "nav-frontend-skjema";
import { Hovedknapp } from "nav-frontend-knapper";
import { CheckboksPanel } from "nav-frontend-skjema";
import { IDokumentVariabler, ISubmal } from "../../utils/DokumentVariabler";
import { useSubfelter } from "./Subfelter";

const StyledMeny = styled.div`
  height: 1300px;
  width: 320px;
  z-index: 10;
  flex-grow: 0;
  flex-shrink: 0;
  background-color: #fff;
  padding-top: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

  display: flex;
  flex-direction: column;

  hr {
    border-width: 1px;
    margin-top: 2rem;
    margin-bottom: 2rem;
  }

  .meny-innhold {
    margin-left: 2rem;
    margin-right: 2rem;

    .meny-element {
      margin-top: 2rem;
      margin-bottom: 2rem;
    }
  }
`;

const StyledHovedknapp = styled(Hovedknapp)`
  margin-top: 4rem;
  margin-bottom: 2rem;
`;

interface MenyProps {
  settDokumentNavn(dokumentNavn: string): void;
  aktivtDokument: string;
  dokumenter: string[];
  dokumentVariabler: IDokumentVariabler | undefined;
  settDokumentVariabler: Dispatch<
    SetStateAction<IDokumentVariabler | undefined>
  >;
}

function Meny(props: MenyProps) {
  const {
    settDokumentNavn,
    aktivtDokument,
    dokumenter,
    dokumentVariabler,
    settDokumentVariabler,
  } = props;

  return (
    <StyledMeny>
      <div className="meny-innhold">
        <div className="meny-element">
          <Select
            value={aktivtDokument}
            label="Brevtype"
            onChange={(e) => {
              settDokumentNavn(e.target.value);
            }}
          >
            <option value={""}>{"---"}</option>
            {dokumenter.map((dokument) => (
              <option key={dokument} value={dokument}>
                {dokument}
              </option>
            ))}
          </Select>
        </div>
        {dokumentVariabler && (
          <Variabler
            dokumentVariabler={dokumentVariabler}
            settDokumentVariabler={settDokumentVariabler}
          />
        )}
      </div>
    </StyledMeny>
  );
}

function Variabler(props: {
  dokumentVariabler: IDokumentVariabler;
  settDokumentVariabler: Dispatch<
    SetStateAction<IDokumentVariabler | undefined>
  >;
}) {
  const { dokumentVariabler, settDokumentVariabler } = props;
  const Subfelter = useSubfelter(dokumentVariabler, settDokumentVariabler);

  return (
    <>
      <Subfelter />
    </>
  );
}

function Flettefelter(props: {
  flettefelter: { [fletteFelt: string]: string };
}) {
  const { flettefelter } = props;
  return (
    <div className="meny-element">
      {Object.keys(flettefelter).map((flettefelt) => (
        <div key={flettefelt}>
          <span>{flettefelt}: </span>
          <Input
            type="text"
            value={flettefelter.fletteFelt}
            alt={flettefelter.fletteFelt}
          />
        </div>
      ))}
    </div>
  );
}
export default Meny;
