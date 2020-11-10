import React, { Dispatch, SetStateAction, useState } from "react";
import styled from "styled-components";
import { RadioPanelGruppe, Select } from "nav-frontend-skjema";
import { Hovedknapp } from "nav-frontend-knapper";
import { IDokumentVariabler, ISubmal } from "../../utils/DokumentVariabler";
import MenyVariabler from "./MenyVariabler";
import { Maalform } from "../../utils/hentGrenesnittFraDokument";

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

interface MenyProps {
  settDokumentNavn(dokumentNavn: string): void;
  aktivtDokument: string;
  dokumenter: string[];
  dokumentVariabler: IDokumentVariabler | undefined;
  settDokumentVariabler: Dispatch<
    SetStateAction<IDokumentVariabler | undefined>
  >;
  maalform: Maalform;
  settMalform: Function;
}

function Meny(props: MenyProps) {
  const {
    settDokumentNavn,
    aktivtDokument,
    dokumenter,
    dokumentVariabler,
    settDokumentVariabler,
    maalform,
    settMalform,
  } = props;

  const [variabler, settVariabler] = useState<IDokumentVariabler | undefined>(
    dokumentVariabler
  );

  return (
    <StyledMeny>
      <div className="meny-innhold">
        <div className="meny-element brevtype">
          <Select
            value={aktivtDokument}
            label="Brevtype"
            onChange={(e) => {
              settDokumentNavn(e.target.value);
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
              onChange: (_) => settMalform("bokmaal"),
              label: "bokmaal",
              name: "maalform",
            },
            {
              checked: maalform === "nynorsk",
              onChange: (_) => settMalform("nynorsk"),
              label: "nynorsk",
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
