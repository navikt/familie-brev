import React, { useCallback, useEffect, useState } from "react";
import Dokument from "./components/Dokument";
import Meny from "./components/meny/Meny";
import styled from "styled-components";
import hentGrenesnittFraDokument, {
  Maalform,
} from "./utils/hentGrenesnittFraDokument";
import { IDokumentVariabler } from "./utils/DokumentVariabler";
import lagPlaceholderVariabler from "./utils/lagPlaceholderVariabler";
import Header from "./components/Header";
import { useLocalStorage } from "./hooks/useLocalStorage";
import hentFraSanity from "./utils/hentFraSanity";

interface Titler {
  [dokumentId: string]: string;
}

function App() {
  const [dokumenter, settDokumenter] = useState<string[]>([]);
  const [titlerBokmaal, settTitlerBokmaal] = useState<Titler>({});
  const [titlerNynorsk, settTitlerNynorsk] = useState<Titler>({});

  const [tittel, settTittel] = useState<string>("");
  const [dokumentId, settDokumentId] = useLocalStorage("dokumentId", undefined);
  const [dokumentVariabler, settDokumentVariabler] = useState<
    IDokumentVariabler
  >();
  const [maalform, settMaalform] = useState<Maalform>("nynorsk");

  const settTitler = (dokumenter: any) => {
    const titlerBokmaal: { [dokumentId: string]: string } = {};
    const titlerNynorsk: { [dokumentId: string]: string } = {};
    dokumenter.forEach((dokument: any) => {
      titlerBokmaal[dokument.id] = dokument.tittelBokmaal;
      titlerNynorsk[dokument.id] = dokument.tittelNynorsk;
    });
    settTitlerBokmaal(titlerBokmaal);
    settTitlerNynorsk(titlerNynorsk);
  };

  const opptaderDokument = useCallback(
    (nyDokumentId: string = dokumentId, nyMaalform: Maalform = maalform) => {
      hentGrenesnittFraDokument(nyDokumentId, nyMaalform)
        .then((res) => {
          settDokumentVariabler(lagPlaceholderVariabler(res));
          settDokumentId(nyDokumentId);
          settMaalform(nyMaalform);
        })
        .catch((e) => alert(e));
    },
    [dokumentId, maalform]
  );

  useEffect(() => {
    switch (maalform) {
      case "bokmaal":
        settTittel(titlerBokmaal[dokumentId]);
        break;
      case "nynorsk":
        settTittel(titlerNynorsk[dokumentId]);
        break;
    }
  }, [dokumentId, maalform, titlerNynorsk, titlerBokmaal]);

  useEffect(() => {
    const query =
      '*[_type == "dokumentmal"][]{id, tittelBokmaal, tittelNynorsk}';

    hentFraSanity(query).then((res: any) => {
      settDokumenter(res.map((dokument: any) => dokument.id));
      settTitler(res);
      opptaderDokument();
    });
  }, [opptaderDokument]);

  const oppdaterMaalform = (nyMaalform: Maalform) => {
    opptaderDokument(undefined, nyMaalform);
  };

  const opptaderDokumentId = (nyDokumentId: string) => {
    opptaderDokument(nyDokumentId);
  };

  const StyledApp = styled.div`
    min-height: 100vh;
    display: flex;
    background-color: #e8e9e9;
  `;

  return (
    <StyledApp>
      <Meny
        maalform={maalform}
        aktivtDokument={dokumentId}
        dokumenter={dokumenter}
        dokumentVariabler={dokumentVariabler}
        settDokumentVariabler={settDokumentVariabler}
        oppdaterMaalform={oppdaterMaalform}
        opptaderDokumentId={opptaderDokumentId}
      />
      {dokumentId && dokumentVariabler && (
        <StyledBrev>
          <Header
            visLogo={true}
            tittel={tittel}
            navn={dokumentVariabler.flettefelter.navn}
            fødselsnr={dokumentVariabler.flettefelter.fodselsnummer}
          />
          <Dokument
            dokumentId={dokumentId}
            dokumentVariabler={dokumentVariabler}
            maalform={maalform}
            erDokumentmal={true}
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

  list-style-type: none;
`;

export default App;
