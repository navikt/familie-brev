import * as React from 'react';
import type { IDokumentData } from '../typer/dokumentApiBrev';
import { Dokument } from './components/Dokument';
import type { Datasett } from './sanity/sanityClient';
import { client } from './sanity/sanityClient';
import { renderToStaticMarkup } from 'react-dom/server';
import { Context } from './utils/Context';
import css from './utils/css';
import { HeaderDeprecated } from './components/HeaderDeprecated';
import { Maalform } from '../typer/sanitygrensesnitt';
import { Feil } from './utils/Feil';
import { ServerStyleSheet } from 'styled-components';

enum HtmlLang {
  NB = 'nb',
  NN = 'nn',
}

export const hentDokumentHtml = async (
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
  const asyncHtml = (styledComponentsCss?: string) => (
    <Context.Provider value={contextValue}>
      <html lang={htmlLang()}>
        <head>
          <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
          <style type="text/css">{css + styledComponentsCss}</style>
          <title>{tittel}</title>
        </head>
        <body className={'body'}>
          <div>
            <HeaderDeprecated
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

  // Rendrer alt og venter på at kontekst skal fylles med all nødvendig data fra Sanity.
  async function lastInnContextAsynkrontForDokumentNivå() {
    const html = renderToStaticMarkup(asyncHtml());
    await Promise.all(contextValue.requests);
    return html;
  }

  // Rendrer alt for å kunne hente ut CSS-string fra Styled-Components
  const byggStyledComponentCss = () => {
    const sheet = new ServerStyleSheet();
    const elementWithCollectedStyles = sheet.collectStyles(asyncHtml());
    renderToStaticMarkup(elementWithCollectedStyles);
    return sheet.instance.toString();
  };

  // Rendrer en siste gang hvor vi injecter Styled-Components CSS-string
  const byggDokumentHtml = (styledComponentCss: string) => {
    return renderToStaticMarkup(asyncHtml(styledComponentCss));
  };

  /* Følger denne guiden for å sørge for at vi har all nødvendig data i context når vi genererer HTML-string:
   * https://medium.com/swlh/how-to-use-useeffect-on-server-side-654932c51b13
   */

  let i = 0;
  let dokument = await lastInnContextAsynkrontForDokumentNivå();
  while (dokument !== (await lastInnContextAsynkrontForDokumentNivå())) {
    if (i++ >= 100) {
      throw new Error('Dokumentet har en dybde på mer enn 100');
    }
    dokument = await lastInnContextAsynkrontForDokumentNivå();
  }

  const styledComponentCss = byggStyledComponentCss();
  let dokumentHtml = byggDokumentHtml(styledComponentCss);

  /*
    "'" blir omgjort til "&#x27;" når vi bygger statisk html.
    "'" brukes i CSSen når vi setter sidetall og må derfor omgjøres tilbake
  */
  dokumentHtml = dokumentHtml.replace(/&#x27;/g, "'");
  return dokumentHtml.replace(/(\r\n|\n|\r)/gm, '');
};
