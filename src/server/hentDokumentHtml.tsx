import * as React from 'react';
import type { IDokumentData } from '../typer/dokumentApi';
import Dokument from './components/Dokument';
import type { Datasett } from './sanity/sanityClient';
import { client } from './sanity/sanityClient';
import { renderToStaticMarkup } from 'react-dom/server';
import Context from './utils/Context';
import css from './utils/css';
import Header from './components/Header';
import { Maalform } from '../typer/sanitygrensesnitt';
import { Feil } from './utils/Feil';

enum HtmlLang {
  NB = 'nb',
  NN = 'nn',
}

const hentDokumentHtml = async (
  apiDokument: IDokumentData,
  maalform: Maalform,
  dokumentApiNavn: string,
  datasett: Datasett,
): Promise<string> => {
  const [tittel] = await client(datasett).fetch(
    `*[_type == "dokument" && apiNavn == "${dokumentApiNavn}" ][].tittel${
      maalform === Maalform.NB ? 'Bokmaal' : 'Nynorsk'
    }`,
  );

  if (!tittel) {
    throw new Feil(
      `Fant ikke ${maalform}-tittel til "${dokumentApiNavn}" i datasettet "${datasett}".`,
      404,
    );
  }

  const htmlLang = () => {
    switch (maalform) {
      case Maalform.NB:
        return HtmlLang.NB;
      case Maalform.NN:
        return HtmlLang.NN;
    }
  };

  const contextValue = { requests: [] };
  const asyncHtml = () => (
    <Context.Provider value={contextValue}>
      <html lang={htmlLang()}>
        <head>
          <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
          <style type="text/css">{css}</style>
          <title>{tittel}</title>
        </head>
        <body className={'body'}>
          <div>
            <Header
              visLogo={true}
              tittel={tittel}
              navn={apiDokument?.flettefelter?.navn}
              fodselsnummer={apiDokument?.flettefelter?.fodselsnummer}
              brevOpprettetDato={
                apiDokument?.flettefelter?.brevOpprettetDato || apiDokument?.flettefelter?.dato
              }
              apiNavn={dokumentApiNavn}
              maalform={maalform}
              organisasjonsnummer={apiDokument?.flettefelter?.organisasjonsnummer}
              gjelder={apiDokument?.flettefelter?.gjelder}
            />
            <Dokument
              dokumentApiNavn={dokumentApiNavn}
              dokumentData={apiDokument}
              maalform={maalform}
              datasett={datasett}
            />
          </div>
        </body>
      </html>
    </Context.Provider>
  );

  async function byggDokumentAsynkront() {
    const html = renderToStaticMarkup(asyncHtml());
    await Promise.all(contextValue.requests);
    return html;
  }

  /* Følger denne guiden:
   * https://medium.com/swlh/how-to-use-useeffect-on-server-side-654932c51b13
   *
   * Resultatet fra eksterne kall blir lagret i konteksten slik at man kan bruke asynkrone funksjoner med serverside rendering.
   *
   * Når man kjører byggDokumentAsynkront flere ganger vil dokumentene og underdokumentene til alt er hentet fra Sanity.
   */
  let i = 0;
  let dokument = await byggDokumentAsynkront();
  while (dokument !== (await byggDokumentAsynkront())) {
    if (i++ >= 100) {
      throw new Error('Dokumentet har en dybde på mer enn 100');
    }
    dokument = await byggDokumentAsynkront();
  }

  /*
    "'" blir omgjort til "&#x27;" når vi bygger statisk html.
    "'" brukes i CSSen når vi setter sidetall og må derfor omgjøres tilbake
  */
  dokument = dokument.replace(/&#x27;/g, "'");
  return dokument.replace(/(\r\n|\n|\r)/gm, '');
};

export default hentDokumentHtml;
