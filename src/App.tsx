import React, { useEffect, useState } from "react";
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
  const [dokumentId, settDokumentId] = useLocalStorage(
    "dokumentId",
    "Innvilget"
  );
  const [aktivtDokument, settAktivtDokument] = useState(dokumentId);
  const [dokumentVariabler, settDokumentVariabler] = useState<
    IDokumentVariabler
  >();
  const [maalform, settMaalform] = useState<Maalform>("nynorsk");

  useEffect(() => {
    const query =
      '*[_type == "dokumentmal"][]{id, tittelBokmaal, tittelNynorsk}';

    hentFraSanity(query).then((res: any) => {
      settDokumenter(res.map((dokument: any) => dokument.id));

      const titlerBokmaal: { [dokumentId: string]: string } = {};
      const titlerNynorsk: { [dokumentId: string]: string } = {};
      res.forEach((dokument: any) => {
        titlerBokmaal[dokument.id] = dokument.tittelBokmaal;
        titlerNynorsk[dokument.id] = dokument.tittelNynorsk;
      });
      settTitlerBokmaal(titlerBokmaal);
      settTitlerNynorsk(titlerNynorsk);
    });
  }, []);

  useEffect(() => {
    aktivtDokument &&
      hentGrenesnittFraDokument(aktivtDokument, maalform).then((res) => {
        settDokumentVariabler(lagPlaceholderVariabler(res));
        settDokumentId(aktivtDokument);
      });
  }, [aktivtDokument]);

  const StyledApp = styled.div`
    display: flex;
    background-color: #e8e9e9;
  `;

  const hentTittel = (): string => {
    switch (maalform) {
      case "bokmaal":
        return titlerBokmaal[dokumentId];
      case "nynorsk":
        return titlerNynorsk[dokumentId];
    }
  };

  return (
    <StyledApp>
      <Meny
        maalform={maalform}
        settMalform={settMaalform}
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
            tittel={hentTittel()}
            navn={dokumentVariabler.flettefelter.navn}
            fødselsnr={dokumentVariabler.flettefelter.fodselsnummer}
          />
          <Dokument
            dokumentId={dokumentId}
            dokumentVariabler={dokumentVariabler}
            maalform={maalform}
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
