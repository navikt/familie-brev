import React, { useEffect, useState } from "react";
import { client } from "./utils/sanity";
import Dokument from "./components/Dokument";
import Dokumentvelger from "./components/Dokumentvelger";
import Meny from "./components/Meny";
import styled from "styled-components";

function App() {
  const [dokumenter, setDokumenter] = useState<string[]>([]);
  const [dokumentNavn, setDokumentNavn] = useState("");

  useEffect(() => {
    const query = '*[_type == "dokumentmal"][].tittel';
    client.fetch(query).then((res: any) => {
      setDokumenter(res);
    });
  }, []);

  const StyledApp = styled.div`
    display: flex;
    background-color: #e8e9e9;
  `

  return (
    <StyledApp>
      <Meny />
      <Dokument dokumentNavn={dokumentNavn} />
    </StyledApp>
  );
}

export default App;
