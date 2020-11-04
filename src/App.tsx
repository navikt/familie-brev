import React, { useEffect, useState } from "react";
import { client } from "./utils/sanity";
import Dokument from "./components/Dokument";
import Meny from "./components/meny/Meny";
import styled from "styled-components";
import hentGrenesnittFraDokument from "./utils/hentGrenesnittFraDokument";
import { IDokumentVariabler } from "./utils/DokumentVariabler";
import lagPlaceholderVariabler from "./utils/hentPlaceholderVariablerFraGrensesnitt";
import Header from "./components/Header";

function App() {
  const [dokumenter, setDokumenter] = useState<string[]>([]);
  const [aktivtDokument, settAktivtDokument] = useState();
  const [dokumentNavn, settDokumentNavn] = useState();
  const [dokumentVariabler, settDokumentVariabler] = useState<
    IDokumentVariabler
  >();

  useEffect(() => {
    const query = '*[_type == "dokumentmal"][].id';
    client.fetch(query).then((res: any) => {
      setDokumenter(res);
    });
  }, []);

  useEffect(() => {
    aktivtDokument &&
      hentGrenesnittFraDokument(aktivtDokument).then((res) => {
        settDokumentVariabler(lagPlaceholderVariabler(res));
        settDokumentNavn(aktivtDokument);
      });
  }, [aktivtDokument]);

  const StyledApp = styled.div`
    display: flex;
    background-color: #e8e9e9;
  `;

  return (
    <StyledApp>
      <Meny
        settDokumentNavn={settAktivtDokument}
        aktivtDokument={aktivtDokument}
        dokumenter={dokumenter}
        dokumentVariabler={dokumentVariabler}
        settDokumentVariabler={settDokumentVariabler}
      />
      {dokumentVariabler && (
        <StyledBrev>
          <Header
            visLogo={true}
            tittel={dokumentNavn}
            navn={dokumentVariabler.flettefelter.navn}
            fødselsnr={dokumentVariabler.flettefelter.fodselsnummer}
          />
          <Dokument
            dokumentNavn={dokumentNavn}
            dokumentVariabler={dokumentVariabler}
          />
        </StyledBrev>
      )}
    </StyledApp>
  );
}

const StyledBrev = styled.div`
  margin: 5rem;
  padding: 5rem;
  width: 800px;
  flex-shrink: 0;
  flex-grow: 0;
  background-color: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

export default App;
