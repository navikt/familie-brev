import { IDokumentVariabler, IValg } from "../../../utils/DokumentVariabler";
import { RadioPanelGruppe } from "nav-frontend-skjema";
import MenyVariabler from "../MenyVariabler";
import React from "react";
import styled from "styled-components";

interface ValgFeltProps {
  valgfelt: IValg;
  navn: string;
  endreValgfeltIDokumentVariabler: Function;
}

function ValgFelt(props: ValgFeltProps) {
  const { navn, valgfelt, endreValgfeltIDokumentVariabler } = props;

  const endreValg = (valg: IValg) => {
    const nyttValgFelt: IValg = {
      muligeValg: valgfelt.muligeValg,
      valgNavn: valg.valgNavn,
      valgVariabler: valg.valgVariabler,
    };
    endreValgfeltIDokumentVariabler(navn, nyttValgFelt);
  };

  const endreValgFeltVariabler = (valgfeltVariabler: IDokumentVariabler) => {
    const nyeMuligeValg = valgfelt.muligeValg?.map((muligValg) =>
      muligValg.valgNavn === valgfelt.valgNavn
        ? {
            muligeValg: undefined,
            valgNavn: muligValg.valgNavn,
            valgVariabler: valgfeltVariabler,
          }
        : muligValg
    );

    const nyttValgFelt = {
      ...valgfelt,
      valgVariabler: valgfeltVariabler,
      muligeValg: nyeMuligeValg,
    };
    endreValgfeltIDokumentVariabler(navn, nyttValgFelt);
  };

  return (
    <>
      <StyledValgHeader>{navn}</StyledValgHeader>
      {valgfelt.muligeValg && (
        <RadioPanelGruppe
          name={"hmm"}
          radios={valgfelt.muligeValg?.map((muligValg) => ({
            checked: muligValg.valgNavn === valgfelt.valgNavn,
            onChange: (e) => endreValg(muligValg),
            label: muligValg.valgNavn,
            name: navn,
          }))}
          onChange={(e) => {
            console.log(e);
          }}
        />
      )}
      {valgfelt.valgVariabler && (
        <MenyVariabler
          settVariabler={endreValgFeltVariabler}
          variabler={valgfelt.valgVariabler}
        />
      )}
    </>
  );
}

const StyledValgHeader = styled.div`
  margin-bottom: 10px;
  font-weight: bold;
`;

export default ValgFelt;
