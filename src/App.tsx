import React, { useEffect, useState } from "react";
import { client } from "./utils/sanity";
import Dokument from "./components/Dokument";
import Dokumentvelger from "./components/Dokumentvelger";
import Meny from "./components/Meny";
import styled from "styled-components";
import { Testgrensesnitt } from "./utils/Testgrensesnitt";

function App() {
  const [dokumenter, setDokumenter] = useState<string[]>([]);
  const [dokumentNavn, settDokumentNavn] = useState("Innvilgelse");
  const [grensesnitt, settGrensesnitt] = useState<any>();

  useEffect(() => {
    const query = '*[_type == "dokumentmal"][].tittel';
    client.fetch(query).then((res: any) => {
      setDokumenter(res);
    });
  }, []);

  useEffect(() => {
    settGrensesnitt(Testgrensesnitt[dokumentNavn])
  }, [dokumentNavn])

  const StyledApp = styled.div`
    display: flex;
    background-color: #e8e9e9;
  `

  return (
    <StyledApp>
      <Meny settDokumentNavn={settDokumentNavn} dokumentNavn={dokumentNavn}/>
      <Dokument
        dokumentNavn={dokumentNavn}
        grensesnitt={Testgrensesnitt[dokumentNavn]}
      />
    </StyledApp>
  );
}

export default App;
