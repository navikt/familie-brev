import * as React from 'react';
import { IDokumentData } from '../typer/dokumentApi';
import Dokument from './components/Dokument';
import { client, Datasett } from './sanity/sanityClient';
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
              dato={apiDokument?.flettefelter?.dato}
              apiNavn={dokumentApiNavn}
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

  async function byggDokument() {
    const html = renderToStaticMarkup(asyncHtml());
    await Promise.all(contextValue.requests);
    return html;
  }

  let i = 0;
  let dokument = await byggDokument();
  while (dokument !== (await byggDokument())) {
    if (i++ >= 100) {
      throw new Error('Dokumentet har en dybde på mer enn 100');
    }
    dokument = await byggDokument();
  }

  /*
    "'" blir omgjort til "&#x27;" når vi bygger statisk html.
    "'" brukes i CSSen når vi setter sidetall og må derfor omgjøres tilbake
  */
  dokument = dokument.replace(/&#x27;/g, "'");
  return dokument.replace(/(\r\n|\n|\r)/gm, '');
};

export default hentDokumentHtml;
