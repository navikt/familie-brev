import React, { useCallback, useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Meny from "./components/meny/Meny";
import styled from "styled-components";
import lagPlaceholderVariabler from "./utils/lagPlaceholderVariabler";
import { useLocalStorageOrQueryParam } from "./hooks/useLocalStorageOrQueryParam";
import { useLocalStorage } from "./hooks/useLocalStorage";
import hentFraSanity from "./utils/hentFraSanity";
import { StorageIds } from "./utils/storageIds";
import { genererPdf, hentGrensesnitt, hentHtml } from "./utils/api";
import { IDokumentVariabler } from "../server/sanity/DokumentVariabler";
import { Maalform } from "../server/sanity/hentGrenesnittFraDokument";
import { Datasett } from "../server/sanity/sanityClient";

const parse = require("html-react-parser");

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const { NODE_ENV } = process.env;

interface Titler {
  [dokumentId: string]: string;
}

function App() {
  const [dokumenter, settDokumenter] = useState<string[]>([]);
  const [titlerBokmaal, settTitlerBokmaal] = useState<Titler>({});
  const [titlerNynorsk, settTitlerNynorsk] = useState<Titler>({});
  const [numPages, setNumPages] = useState(0);

  const [tittel, settTittel] = useState<string>("");
  const [dokumentId, settDokumentId] = useLocalStorageOrQueryParam(
    "dokumentId",
    undefined,
    window.location
  );
  const [dokumentVariabler, settDokumentVariabler] = useState<
    IDokumentVariabler
  >();
  const [pdf, settPdf] = useState<Uint8Array | Blob | undefined>(undefined);
  const [html, settHtml] = useState<string>("");

  const maalformStorageId = StorageIds.MAALFORM + dokumentId;

  const [maalform, settMaalform] = useLocalStorage<Maalform>(
    maalformStorageId,
    Maalform.NN
  );

  const [datasett, settDatasett] = useLocalStorage<Datasett>(
    "datasett",
    Datasett.BA
  );

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

  useEffect(() => {
    dokumentId &&
      dokumentVariabler &&
      hentHtml(dokumentVariabler, maalform, dokumentId, datasett).then(
        (res) => {
          settHtml(res.data);
          genererPdf(res.data).then((x) => settPdf(x));
        }
      );
  }, [dokumentVariabler, maalform, dokumentId, datasett, tittel]);

  const opptaderDokument = useCallback(
    (nyDokumentId: string = dokumentId, nyMaalform: Maalform = maalform) => {
      hentGrensesnitt(nyMaalform, nyDokumentId, datasett)
        .then((res) => {
          settDokumentVariabler(lagPlaceholderVariabler(res.data[0]));
          settDokumentId(nyDokumentId);
          settMaalform(nyMaalform);
        })
        .catch((e) => console.log(e));
    },
    [dokumentId, maalform, datasett, settMaalform, settDokumentId]
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

    hentFraSanity(query, datasett).then((res: any) => {
      settDokumenter(res.map((dokument: any) => dokument.id));
      settTitler(res);
      opptaderDokument(dokumentId ? dokumentId : res[0].id);
    });
  }, [dokumentId, opptaderDokument, datasett]);

  const oppdaterMaalform = (nyMaalform: Maalform) => {
    opptaderDokument(undefined, nyMaalform);
  };

  const opptaderDokumentId = (nyDokumentId: string | undefined) => {
    opptaderDokument(nyDokumentId);
  };

  const oppdaterDatasett = (datasett: Datasett) => {
    settDatasett(datasett);
    settDokumentId(undefined);
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
        oppdaterDatasett={oppdaterDatasett}
        datasett={datasett}
      />
      {pdf && (
        <StyledDokumentKonteiner>
          <Document
            file={pdf}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={console.error}
          >
            {Array.apply(null, Array(numPages))
              .map((_, i) => i + 1)
              .map((page) => (
                <>
                  <StyledPage pageNumber={page} />
                  {page !== numPages && <StyledSidedeler />}
                </>
              ))}
          </Document>
        </StyledDokumentKonteiner>
      )}
      {NODE_ENV !== "production" && html && (
        <StyledDokumentKonteiner>
          <BrevPadding>{parse(html)}</BrevPadding>
        </StyledDokumentKonteiner>
      )}
    </StyledApp>
  );
}
const StyledSidedeler = styled.div`
  height: 20px;
  background-color: #e8e9e9;
`;

const BrevPadding = styled.div`
  padding: 3rem;
`;

const StyledPage = styled(Page)`
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const StyledDokumentKonteiner = styled.div`
  margin: 5rem;
  flex-shrink: 0;
  flex-grow: 0;

  list-style-type: none;
`;

export default App;
