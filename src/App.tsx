import React, { useEffect, useState } from "react";
import { client } from "./utils/sanity";
import Dokument from "./components/Dokument";
import Dokumentvelger from "./components/Dokumentvelger";
import Meny from "./components/Meny";
import styled from "styled-components";
import hentGrenesnittFraDokument from "./utils/hentGrenesnittFraDokument";
import { IDokumentVariabler } from "./utils/Grensesnitt";
import lagPlaceholderVariabler from "./utils/hentPlaceholderVariablerFraGrensesnitt";

function App() {
  const [dokumenter, setDokumenter] = useState<string[]>([]);
  const [dokumentNavn, settDokumentNavn] = useState("Begrunnelser");
  const [dokumentVariabler, settDokumentVariabler] = useState<
    IDokumentVariabler
  >();

  useEffect(() => {
    const query = '*[_type == "dokumentmal"][].tittel';
    client.fetch(query).then((res: any) => {
      setDokumenter(res);
    });
  }, []);

  useEffect(() => {
    hentGrenesnittFraDokument(dokumentNavn).then((res) => {
      settDokumentVariabler(lagPlaceholderVariabler(res));
    });
  }, [dokumentNavn]);

  const StyledApp = styled.div`
    display: flex;
    background-color: #e8e9e9;
  `

  return (
    <StyledApp>
      <Meny settDokumentNavn={settDokumentNavn} dokumentNavn={dokumentNavn} />
      {dokumentVariabler && (
        <Dokument
          dokumentNavn={dokumentNavn}
          dokumentVariabler={dokumentVariabler}
        />
      )}
    </StyledApp>
  );
}

export default App;
