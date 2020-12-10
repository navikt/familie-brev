import React, { useCallback, useEffect, useRef, useState } from "react";
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
import NavFrontendSpinner from "nav-frontend-spinner";

const parse = require("html-react-parser");

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const { NODE_ENV } = process.env;

interface Dokument {
  dokumentId: string | undefined;
  maalform: Maalform;
  datasett: Datasett;
}

function App() {
  const [dokumenter, settDokumenter] = useState<string[]>([]);
  const [numPages, setNumPages] = useState(0);

  const [dokumentId, settDokumentId] = useLocalStorageOrQueryParam(
    "dokumentId",
    undefined,
    window.location
  );
  const dokumentIdRef = useRef(dokumentId);

  const [dokumentVariabler, settDokumentVariabler] = useState<
    IDokumentVariabler
  >();
  const [pdf, settPdf] = useState<Uint8Array | Blob>(new Blob());
  const [html, settHtml] = useState<string>("");
  const [isLoading, settIsLoading] = useState(true);
  const isFirstRender = useRef(true);

  const maalformStorageId = StorageIds.MAALFORM + dokumentId;
  const [maalform, settMaalform] = useLocalStorage<Maalform>(
    maalformStorageId,
    Maalform.NN
  );

  const [datasett, settDatasett] = useLocalStorage<Datasett>(
    "datasett",
    Datasett.BA
  );

  const dokument = useRef<Dokument>({ dokumentId, maalform, datasett });

  const opptaderDokument = useCallback(
    async (
      nyDokumentId: string = dokumentId,
      nyMaalform: Maalform = maalform
    ) => {
      settIsLoading(true);
      const grensesnitt = await hentGrensesnitt(
        dokument.current.datasett,
        nyMaalform,
        nyDokumentId
      );
      const dokumentVariabler = lagPlaceholderVariabler(grensesnitt[0]);
      dokument.current = {
        ...dokument.current,
        dokumentId: nyDokumentId,
        maalform: nyMaalform,
      };
      settDokumentVariabler(dokumentVariabler);
    },
    [dokumentId, maalform]
  );

  const opptaderDokumentRef = useRef(opptaderDokument);
  useEffect(() => {
    const query = '*[_type == "dokumentmal"][].id';

    hentFraSanity(query, datasett).then((dokumenter: any) => {
      dokument.current.datasett = datasett;
      settDokumenter(dokumenter);
      if (dokumentIdRef.current && dokumenter.includes(dokumentIdRef.current)) {
        opptaderDokumentRef.current();
      } else {
        settDokumentId(dokumenter[0]);
      }
    });
  }, [datasett, settDokumentId]);

  useEffect(() => {
    dokumentIdRef.current = dokumentId;
    if (!isFirstRender.current) {
      opptaderDokument(dokumentId, maalform);
    }
    isFirstRender.current = false;
  }, [dokumentId, maalform, opptaderDokument]);

  useEffect(() => {
    if (dokumentVariabler && dokument.current.dokumentId) {
      settIsLoading(true);

      const { datasett, maalform, dokumentId } = dokument.current;
      hentHtml(datasett, maalform, dokumentId, dokumentVariabler).then(
        (html) => {
          settHtml(html);
          genererPdf(html).then((pdf) => settPdf(pdf));

          settIsLoading(false);
        }
      );
    }
  }, [dokumentVariabler]);

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
        oppdaterMaalform={settMaalform}
        opptaderDokumentId={settDokumentId}
        oppdaterDatasett={settDatasett}
        datasett={datasett}
      />
      {isLoading ? (
        <StyledSpinnerKonteiner>
          <NavFrontendSpinner transparent />
        </StyledSpinnerKonteiner>
      ) : (
        <StyledDokumentKonteiner>
          <Document
            file={pdf}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={console.error}
          >
            {Array.apply(null, Array(numPages))
              .map((_, i) => i + 1)
              .map((page) => (
                <div key={page}>
                  <StyledPage pageNumber={page} scale={1.4} />
                  {page !== numPages && <StyledSidedeler />}
                </div>
              ))}
          </Document>
        </StyledDokumentKonteiner>
      )}
      {NODE_ENV !== "production" && html && (
        <StyledDokumentKonteiner>
          <StyledDokument>
            <BrevPadding>{parse(html)}</BrevPadding>
          </StyledDokument>
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

const StyledDokument = styled.div`
  background-color: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const StyledDokumentKonteiner = styled.div`
  margin: 5rem;
  flex-shrink: 0;
  flex-grow: 0;

  list-style-type: none;
`;

const StyledSpinnerKonteiner = styled.div`
  margin: 28rem;
`;

export default App;
