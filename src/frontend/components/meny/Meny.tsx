import React, { Dispatch, SetStateAction, useState } from "react";
import styled from "styled-components";
import { RadioPanelGruppe, Select } from "nav-frontend-skjema";
import { Hovedknapp } from "nav-frontend-knapper";
import { IDokumentVariabler } from "../../utils/DokumentVariabler";
import MenyVariabler from "./MenyVariabler";
import { Maalform } from "../../utils/hentGrenesnittFraDokument";
import { Datasett } from "../../utils/sanity";

const StyledMeny = styled.div`
  width: 400px;
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

const { NODE_ENV } = process.env;

interface MenyProps {
  aktivtDokument: string;
  dokumenter: string[];
  dokumentVariabler: IDokumentVariabler | undefined;
  settDokumentVariabler: Dispatch<
    SetStateAction<IDokumentVariabler | undefined>
  >;
  maalform: Maalform;
  opptaderDokumentId: (nyDokumentId: string) => void;
  oppdaterMaalform: (nyMaalform: Maalform) => void;
  oppdaterDatasett: Function;
  datasett: Datasett;
}

function Meny(props: MenyProps) {
  const {
    aktivtDokument,
    dokumenter,
    dokumentVariabler,
    settDokumentVariabler,
    maalform,
    opptaderDokumentId,
    oppdaterMaalform,
    oppdaterDatasett,
    datasett,
  } = props;

  const [variabler, settVariabler] = useState<IDokumentVariabler | undefined>(
    dokumentVariabler
  );

  return (
    <StyledMeny>
      <div className="meny-innhold">
        <Select
          value={datasett}
          label="Datasett"
          onChange={(e) => {
            oppdaterDatasett(e.target.value);
          }}
        >
          <option value={Datasett.BA}>{Datasett.BA}</option>
          <option value={Datasett.EF}>{Datasett.EF}</option>
          {NODE_ENV !== "production" && (
            <option value={Datasett.TEST}>{Datasett.TEST}</option>
          )}
        </Select>
        <div className="meny-element brevtype">
          <Select
            value={aktivtDokument}
            label="Brevtype"
            onChange={(e) => {
              opptaderDokumentId(e.target.value);
            }}
          >
            {dokumenter.map((dokument) => (
              <option key={dokument} value={dokument}>
                {dokument}
              </option>
            ))}
          </Select>
        </div>

        <RadioPanelGruppe
          name={"maalform"}
          radios={[
            {
              checked: maalform === "bokmaal",
              onChange: (_) => oppdaterMaalform("bokmaal"),
              label: "Bokmål",
              name: "maalform",
            },
            {
              checked: maalform === "nynorsk",
              onChange: (_) => oppdaterMaalform("nynorsk"),
              label: "Nynorsk",
              name: "nynorsk",
            },
          ]}
          onChange={() => {}}
        />

        {variabler && (
          <>
            <MenyVariabler
              variabler={variabler}
              settVariabler={settVariabler}
            />
            <StyledHovedknapp onClick={() => settDokumentVariabler(variabler)}>
              Generer dokument
            </StyledHovedknapp>
          </>
        )}
      </div>
    </StyledMeny>
  );
}

export default Meny;
