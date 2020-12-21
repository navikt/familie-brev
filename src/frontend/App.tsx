import React, { useCallback, useEffect, useRef, useState } from 'react';
import Meny from './components/meny/Meny';
import Pdf from './components/Pdf';
import styled from 'styled-components';
import lagPlaceholderVariabler from './utils/lagPlaceholderVariabler';
import { useLocalStorageOrQueryParam } from './hooks/useLocalStorageOrQueryParam';
import { useLocalStorage } from './hooks/useLocalStorage';
import hentFraSanity from './utils/hentFraSanity';
import { StorageIds } from './utils/storageIds';
import { genererPdf, hentGrensesnitt, hentHtml } from './utils/api';
import { IDokumentVariabler } from '../server/sanity/DokumentVariabler';
import { Maalform } from '../server/sanity/hentGrenesnittFraDokument';
import { Datasett } from '../server/sanity/sanityClient';
import NavFrontendSpinner from 'nav-frontend-spinner';
import parse from 'html-react-parser';

const { NODE_ENV } = process.env;

interface Dokument {
  dokumentId: string | undefined;
  maalform: Maalform;
  datasett: Datasett;
}

function App() {
  const [dokumenter, settDokumenter] = useState<string[]>([]);

  const [dokumentId, settDokumentId] = useLocalStorageOrQueryParam(
    'dokumentId',
    undefined,
    window.location,
  );
  const dokumentIdRef = useRef(dokumentId);

  const [dokumentVariabler, settDokumentVariabler] = useState<IDokumentVariabler>();
  const [pdf, settPdf] = useState<Uint8Array | Blob>(new Blob());
  const [html, settHtml] = useState<string>('');
  const [isLoading, settIsLoading] = useState(true);
  const isFirstRender = useRef(true);

  const maalformStorageId = StorageIds.MAALFORM + dokumentId;
  const [maalform, settMaalform] = useLocalStorage<Maalform>(maalformStorageId, Maalform.NN);

  const [datasett, settDatasett] = useLocalStorage<Datasett>('datasett', Datasett.BA);

  const dokument = useRef<Dokument>({ dokumentId, maalform, datasett });

  const opptaderDokument = useCallback(
    async (nyDokumentId: string = dokumentId, nyMaalform: Maalform = maalform) => {
      settIsLoading(true);
      const grensesnitt = await hentGrensesnitt(
        dokument.current.datasett,
        nyMaalform,
        nyDokumentId,
      );
      const dokumentVariabler = lagPlaceholderVariabler(grensesnitt[0]);
      dokument.current = {
        ...dokument.current,
        dokumentId: nyDokumentId,
        maalform: nyMaalform,
      };
      settDokumentVariabler(dokumentVariabler);
    },
    [dokumentId, maalform],
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
    (async () => {
      if (dokumentVariabler && dokument.current.dokumentId) {
        settIsLoading(true);

        const { datasett, maalform, dokumentId } = dokument.current;
        const html = await hentHtml(datasett, maalform, dokumentId, dokumentVariabler);
        settHtml(html);
        const pdf = await genererPdf(html);
        settPdf(pdf);
        settIsLoading(false);
      }
    })();
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
      <StyledDokumentKonteiner>
        {isLoading ? (
          <StyledSpinnerKonteiner transparent />
        ) : (
          <Pdf pdf={pdf} loading={<StyledSpinnerKonteiner transparent />} />
        )}
      </StyledDokumentKonteiner>
      {NODE_ENV !== 'production' && html && (
        <StyledDokument>
          <BrevPadding>{parse(html)}</BrevPadding>
        </StyledDokument>
      )}
    </StyledApp>
  );
}

const BrevPadding = styled.div`
  padding: 3rem;
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

const StyledSpinnerKonteiner = styled(NavFrontendSpinner)`
  padding: 23rem;
  height: 32px;
  min-width: 32px;
`;

export default App;
